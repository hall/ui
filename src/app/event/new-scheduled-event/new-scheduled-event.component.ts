import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ClrWizard, ClrSignpostContent } from '@clr/angular';
import { ScheduledEvent } from '../scheduledevent';
import { Scenario } from '../../scenario/scenario';
import { ScenarioService } from '../../scenario/scenario.service';
import { Course } from '../../course/course';
import { CourseService } from '../../course/course.service';
import { EnvironmentService } from '../../environment/environment.service';
import { combineAll, concatMap, map, filter } from 'rxjs/operators';
import { Environment } from '../../environment/environment';
import { from, of } from 'rxjs';
import { EnvironmentAvailability } from '../../environment/environmentavailability';
import { ScheduledeventService } from '../../event/scheduledevent.service';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn, ValidationErrors, FormBuilder } from '@angular/forms';
import { DlDateTimePickerChange } from 'angular-bootstrap-datetimepicker';

@Component({
  selector: 'new-scheduled-event',
  templateUrl: './new-scheduled-event.component.html',
  styleUrls: ['./new-scheduled-event.component.scss']
})
export class NewScheduledEventComponent implements OnInit {
  @Output()
  public updated: EventEmitter<boolean> = new EventEmitter(false);

  @Input()
  public event: ScheduledEvent;

  public wzOpen: boolean = false;
  public se: ScheduledEvent = new ScheduledEvent();
  public scenarios: Scenario[];
  public courses: Course[];

  public saving: boolean = false;

  public tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  public times: string[] = [];

  public availableEnvironments: EnvironmentAvailability[] = [];
  public checkingEnvironments: boolean = true;
  public environments: Environment[] = [];
  public keyedEnvironments: Map<string, Environment> = new Map();
  public selectedEnvironments: EnvironmentAvailability[] = [];

  public startDate: string;
  public endDate: string;
  public startTime: string;
  public endTime: string;

  public simpleMode: boolean = true;

  public validTimes: boolean = false;

  public vmtotals: Map<string, number> = new Map();

  public selectedscenarios: Scenario[] = [];
  public selectedcourses: Course[] = [];

  public simpleUserCounts: {} = {};
  public requiredVmCounts: {} = {};
  public maxUserCounts: {} = {};
  public invalidSimpleEnvironments: string[] = [];

  constructor(
    private _fb: FormBuilder,
    public ss: ScenarioService,
    public cs: CourseService,
    public ses: ScheduledeventService,
    public es: EnvironmentService
  ) { }

  public eventDetails: FormGroup = new FormGroup({
    'name': new FormControl(this.se.name, [
      Validators.required,
      Validators.minLength(4)
    ]),
    'description': new FormControl(this.se.description, [
      Validators.required,
      Validators.minLength(4)
    ]),
    'access_code': new FormControl(this.se.access_code, [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern(/^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*/)
    ]),
    'restricted_bind': new FormControl(true)
  })

  public vmCounts: FormGroup = new FormGroup({});

  public simpleModeVmCounts: FormGroup = this._fb.group({
    envs: this._fb.array([])
  })

  public copyEventDetails() {
    this.se.name = this.eventDetails.get('name').value;
    this.se.description = this.eventDetails.get('description').value;
    this.se.access_code = this.eventDetails.get('access_code').value;
    this.se.disable_restriction = !this.eventDetails.get("restricted_bind").value; // opposite, since restricted_bind: enabled really means disable_restriction: false
  }

  @ViewChild("wizard", { static: true }) wizard: ClrWizard;
  @ViewChild("startTimeSignpost") startTimeSignpost: ClrSignpostContent;
  @ViewChild("endTimeSignpost") endTimeSignpost: ClrSignpostContent;

  public scenariosSelected(s: Scenario[]) {
    this.se.scenarios = [];
    s.forEach(
      (sc: Scenario) => this.se.scenarios.push(sc.id)
    )
  }
  public coursesSelected(c: Course[]) {
    this.se.courses = [];
    c.forEach(
      (co: Course) => this.se.courses.push(co.id)
    )
  }

  public getTemplates(env: string) {
    return Object.keys(this.keyedEnvironments.get(env).template_mapping);
  }

  public getTotals() {
    return Object.entries(this.vmtotals);
  }

  public getVMCount(env: string, template: string) {
    return this.se.required_vms[env] ? this.se.required_vms[env][template] : 0;
  }

  public setupVMSelection() {
    this.calculateRequiredVms();
    this.maxUserCount();
    // reset
    this.vmCounts = new FormGroup({});
    this.simpleModeVmCounts = this._fb.group({
      envs: this._fb.array([])
    })
    // Steps: 1. get selected environments.
    // 2. For each environment, if it is supported in that environment, add an input for the vmtype in the scenario
    this.invalidSimpleEnvironments = []; // reset invalid simple mode environments
    this.selectedEnvironments.forEach((ea: EnvironmentAvailability) => {
      this.setupSimpleVMPage(ea);
      this.setupAdvancedVMPage(ea);
    })
  }

  public setupAdvancedVMPage(ea: EnvironmentAvailability) {
    var newFormGroup = new FormGroup({});
    this.getTemplates(ea.environment).forEach((templateName: string, index: number) => {
      var initVal = 0;
      if (this.se.required_vms[ea.environment]) {
        initVal = this.se.required_vms[ea.environment][templateName] || 0; // so we don't blow away old input values when rebuilding this form
      }
      var newControl = new FormControl(initVal, [Validators.pattern(/-?\d+/), Validators.max(ea.available_count[templateName])]);
      newFormGroup.addControl(templateName, newControl);
    });

    this.vmCounts.addControl(ea.environment, newFormGroup);
  }

  public setupSimpleVMPage(ea: EnvironmentAvailability) {
    // go through each required VM (and its count) and verify that a) it exists in the selected environment and b) there is a minimum count that supports a single user
    // (otherwise don't list it)
    var meetsCriteria = true;
    Object.keys(this.requiredVmCounts).forEach((requiredVm: string, index: number) => {
      if (!ea.available_count[requiredVm] || ea.available_count[requiredVm] < this.requiredVmCounts[requiredVm]) {
        // this template either doesn't exist in the environment, or doesn't match a minimum count
        meetsCriteria = false;
        this.invalidSimpleEnvironments.push(ea.environment);
      }
    });

    if (meetsCriteria) {
      var initVal = 0;
      if (this.simpleUserCounts[ea.environment]) {
        initVal = this.simpleUserCounts[ea.environment] || 0; // so we don't blow away old input values when rebuilding this form
      }
      var newControl = new FormControl(initVal, [Validators.pattern(/-?\d+/), Validators.max(this.maxUserCounts[ea.environment])]);
      (this.simpleModeVmCounts.get('envs') as FormArray).push(newControl);
    }
  }

  public copyVMCounts() {
    // clean up
    this.se.required_vms = {};
    this.simpleUserCounts = {};

    if (this.simpleMode) {
      this.selectedEnvironments.forEach((env, i) => {
        var users = this.simpleModeVmCounts.get(['envs', i]).value;
        this.simpleUserCounts[env.environment] = users;
        if (users == 0) { return; }
        Object.keys(this.requiredVmCounts).forEach((template, j) => {
          if (!this.se.required_vms[env.environment]) { this.se.required_vms[env.environment] = {}; }
          this.se.required_vms[env.environment][template] = (users * this.requiredVmCounts[template]);
        })
      })
    } else {
      // basically do setupVMSelection in reverse and shove the results into se.required_vms
      this.selectedEnvironments.forEach((ea: EnvironmentAvailability) => {
        // for each template, get the count.
        this.getTemplates(ea.environment).forEach((template: string) => {
          var val = this.vmCounts.get(ea.environment).get(template).value;
          if (val != 0) { // only map vm counts that are not 0 (instead of using >0 so that -1 is allowable)
            if (!this.se.required_vms[ea.environment]) { this.se.required_vms[ea.environment] = {}; }
            this.se.required_vms[ea.environment][template] = val;
          }
        })
      })
    }
  }

  /*
  Calculate the maximum number of users that can be scheduled in an environment.
  This is used for the simple method of VM provisioning.
  */
  public maxUserCount() {
    this.maxUserCounts = {}; // map[string]int
    // we need to get the number of VMs of each type that a user needs
    // then divide that amount by the number of _available_ VMs, arriving at a max.
    // this max will be passed to the Angular FormControl as a max() validator.
    // it also will be displayed on the page for the users knowledge
    this.selectedEnvironments.forEach((se, i) => {
      // for each environment, get the templates supported by that environment
      var min = Number.MAX_SAFE_INTEGER;
      Object.keys(se.available_count).forEach((template, j) => {
        if ((se.available_count[template] / this.requiredVmCounts[template]) < min) {
          min = se.available_count[template] / this.requiredVmCounts[template];
          min = Math.floor(min);
        }
      })

      this.maxUserCounts[se.environment] = min;
    })
  }

  public calculateRequiredVms() {
    this.requiredVmCounts = {}; // this will be map[string]int, where string is vm template and int is required count
    this.selectedscenarios.forEach((ss, i) => { // ss is selectedscenario, i is index
      ss.virtualmachines?.forEach((vmset, j) => { // vmset is virtualmachineset, j is index
        Object.values(vmset).forEach((template: string, k) => { // tmeplate is vmtemplate name, k is index
          if (this.requiredVmCounts[template]) {
            this.requiredVmCounts[template]++;
          } else {
            this.requiredVmCounts[template] = 1;
          }
        })
      })
    })
    this.selectedcourses.forEach((sc, i) => { // sc is selected course, i is index
      sc.virtualmachines?.forEach((vmset, j) => { // vmset is virtualmachineset, j is index
        Object.values(vmset).forEach((template: string, k) => { // template is vmtemplate name, k is index
          if (this.requiredVmCounts[template]) {
            this.requiredVmCounts[template]++;
          } else {
            this.requiredVmCounts[template] = 1;
          }
        })
      })
    })
  }

  controls(path: string) {
    var group;
    if (path == '') {
      group = this.vmCounts as FormGroup;
    } else {
      group = this.vmCounts.get(path) as FormGroup;
    }
    return Object.keys(group.controls)
  }

  ngOnChanges() {
    if (this.event) {
      this.se = this.event;
      this.eventDetails.setValue({
        'name': this.se.name,
        'description': this.se.description,
        'access_code': this.se.access_code,
        'restricted_bind': true
      });

      // auto-select the environments
      this.se.scenarios?.forEach(
        (sid: string) => {
          // find matching if there is one, and push into selectedscenarios
          this.scenarios.map(
            (s: Scenario) => {
              if (s.id == sid) {
                this.selectedscenarios.push(s);
              }
            }
          )
        }
      )
      this.se.courses?.forEach(
        (sid: string) => {
          // find matching if there is one, and push into selectedcourses
          this.courses.map(
            (c: Course) => {
              if (c.id == sid) {
                this.selectedcourses.push(c);
              }
            }
          )
        }
      )
    } else {
      this.se = new ScheduledEvent();
      this.se.required_vms = {};
    }
  }

  public simpleUserTotal() {
    var total = 0;
    for (var i = 0; i < (this.simpleModeVmCounts.get('envs') as FormArray).length; i++) {
      total += (this.simpleModeVmCounts.get(['envs', i]) as FormControl).value;
    }
    return total;
  }

  ngOnInit() {
    if (this.event) {
      // we have passed in an event for editing
      this.se = this.event;
    } else {
      this.se = new ScheduledEvent();
      this.se.required_vms = {};
    }

    this.ss.list("admin")
      .subscribe(
        (s: Scenario[]) => { this.scenarios = s },
      );
    this.cs.list("admin")
      .subscribe(
        (c: Course[]) => { this.courses = c },
      );

    // setup the times
    ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"].forEach(
      (hr: string) => {
        ["00", "30"].forEach(
          (min: string) => {
            this.times.push(hr + ":" + min);
          }
        )
      }
    )
  }

  // get all environments
  // for each environment, ask for available resources between start and end time
  // display those results
  public checkEnvironments() {
    this.checkingEnvironments = true;
    var templates: Map<string, boolean> = new Map();

    // add all chosen templates to the list
    this.selectedscenarios.forEach(
      (s: Scenario) => {
        s.virtualmachines?.forEach(
          (se: Map<string, string>) => {
            Object.entries(se).forEach(
              (ee: string[]) => templates.set(ee[1], true)
            )
          }
        )
      }
    )
    this.selectedcourses.forEach(
      (c: Course) => {
        c.virtualmachines?.forEach(
          (se: Map<string, string>) => {
            Object.entries(se).forEach(
              (ee: string[]) => templates.set(ee[1], true)
            )
          }
        )
      }
    )

    this.es.list()
      .pipe(
        concatMap((e: Environment[]) => {
          this.environments = e;
          return from(e);
        }),
        filter((e: Environment) => {
          // first add to keyed environment, regardless of if we use it or not
          this.keyedEnvironments.set(e.name, e);
          let pass = false;
          Object.keys(e.template_mapping).forEach(
            (s: string) => {
              if (templates.has(s)) {
                pass = true;
              } else {
                pass = pass;
              }
            }
          )
          return pass;
        }),
        concatMap((e: Environment) => {
          return this.es.available(e.name, this.se.start_time, this.se.end_time);
        }),
        map(
          (ea: EnvironmentAvailability) => {
            return of(ea);
          }
        ),
        combineAll()
      ).subscribe(
        (ea: EnvironmentAvailability[]) => {
          this.availableEnvironments = ea;
          this.checkingEnvironments = false;

          if (this.event) {
            // we are updating instead of creating new
            // so we need to select the environments
            this._mapExistingEnvironments(Object.keys(this.event.required_vms));
          } else if (Object.keys(this.vmCounts.controls).length > 0) {
            // there exists fields filled in for vm counts - user probably went back in the form
            this._mapExistingEnvironments(Object.keys(this.vmCounts.controls));
          }
        }
      )
  }

  private _mapExistingEnvironments(envs: string[]) {
    envs.forEach(
      (eid: string) => {
        this.availableEnvironments.map(
          (ea: EnvironmentAvailability) => {
            if (ea.environment == eid) {
              this.selectedEnvironments.push(ea);
            }
          }
        )
      }
    )
  }

  public setStartTime(d: DlDateTimePickerChange<Date>) {
    this.se.start_time = d.value;
    this.startTimeSignpost.close();
  }

  public setEndTime(d: DlDateTimePickerChange<Date>) {
    this.se.end_time = d.value;
    this.endTimeSignpost.close();
  }

  public open() {
    this.simpleMode = true;
    this.validTimes = false;
    this.se = new ScheduledEvent();
    this.eventDetails.reset({
      'restricted_bind': true
    });
    this.se.required_vms = new Map();
    this.selectedEnvironments = [];
    this.selectedscenarios = [];
    this.selectedcourses = [];
    this.startDate = this.startTime = this.endDate = this.endTime = "";
    this.wizard.reset();
    this.wizard.open();
    this.vmCounts = new FormGroup({});
  }

  public save() {
    this.saving = true;
    if (this.event) {
      this.ses.update(this.se)
        .subscribe(
          (reply: string) => {
            this.updated.next(true);
          },
          (err: any) => {
            this.updated.next(true);
          }
        )
    } else {
      this.ses.create(this.se)
        .subscribe(
          (reply: string) => {
            this.updated.next(true);
          },
          (err: any) => {
            this.updated.next(true);
          }
        )
    }
  }

}
