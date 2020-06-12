import { Component, OnInit, ViewChild, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ClrWizard, ClrSignpostContent } from '@clr/angular';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AccessCode } from 'src/app/data/accesscode';
import { AccessCodeService } from 'src/app/data/accesscode.service';
import { ServerResponse } from 'src/app/data/serverresponse';
import { DlDateTimePickerChange } from 'angular-bootstrap-datetimepicker';
import { CourseService } from 'src/app/data/course.service';
import { ScenarioService } from 'src/app/data/scenario.service';
import { Course } from 'src/app/data/course';
import { Scenario } from 'src/app/data/scenario';

@Component({
  selector: 'edit-accesscode-wizard',
  templateUrl: './edit-accesscode.component.html',
  styleUrls: ['./edit-accesscode.component.scss']
})
export class EditAccessCodeComponent implements OnInit, OnChanges {
  public accessCodeDetails: FormGroup;
  public accessCodeSpecifics: FormGroup;
  public templateMappings: FormGroup;
  public ipMapping: FormGroup;

  @Input()
  public updateAc: AccessCode;

  @Output()
  public event: EventEmitter<boolean> = new EventEmitter(false);

  public ac: AccessCode = new AccessCode();

  public courses: Course[] = [];
  public scenarios: Scenario[] = [];
  public selectedscenarios: Scenario[] = [];
  public selectedcourses: Course[] = [];

  constructor(
    private _fb: FormBuilder,
    private acService: AccessCodeService,
    private courseService: CourseService,
    private scenarioService: ScenarioService
  ) { }


  @ViewChild("expirationTimeSignpost", { static: true }) expirationTimeSignpost: ClrSignpostContent;
  @ViewChild("wizard_ac", { static: true }) wizard: ClrWizard;

  public setExpiration(d: DlDateTimePickerChange<Date>) {
    if (d.value != null){
      this.ac.expiration = new Date(d.value);
    }
    this.expirationTimeSignpost.close();
  }
  public unsetExpiration() {
    this.ac.expiration = null
  }

  public buildAccessCodeDetails(edit: boolean = false) {
    this.accessCodeDetails = this._fb.group({
      code: [edit ? this.updateAc.code : '', [Validators.required, Validators.minLength(4)]],
      id: [edit ? this.updateAc.id : ''],
      description: [edit ? this.updateAc.description : ''],
      max_users: [edit ? this.updateAc.max_users : ''],
      allowed_domains: [edit ? this.updateAc.allowed_domains.join("\n") : ''],
      scenarios: [edit ? this.updateAc.scenarios : ''],
      courses: [edit ? this.updateAc.courses : ''],
      restricted_bind: [edit ? this.updateAc.restricted_bind : ''],
      restricted_bind_value: [edit ? this.updateAc.restricted_bind_value : '']
    });
  }

  ngOnChanges() {
    if (this.updateAc) {
      this._prepare();

      // auto-select the environments
      if (this.updateAc.scenarios) {
        this.updateAc.scenarios.forEach(
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
      }

      if (this.updateAc.courses) {
        this.updateAc.courses.forEach(
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
      }

    }
  }

  ngOnInit() {
    this._build();

    this.courseService.list().subscribe(
      (c: Course[]) => this.courses = c
    )
    this.scenarioService.list().subscribe(
      (s: Scenario[]) => this.scenarios = s
    )
  }

  private _build() {
    this.buildAccessCodeDetails();
  }

  private _prepare() {
    this.buildAccessCodeDetails(true);
  }

  public scenariosSelected(s: Scenario[]) {
    this.ac.scenarios = [];
    s.forEach(
      (sc: Scenario) => this.ac.scenarios.push(sc.id)
    )
  }
  public coursesSelected(c: Course[]) {
    this.ac.courses = [];
    c.forEach(
      (co: Course) => this.ac.courses.push(co.id)
    )
  }

  public open() {
    this.ac = new AccessCode();
    this._build();
    this.wizard.reset();
    if (this.updateAc) {
      this._prepare();
    }
    this.wizard.open();
  }

  public copyAccessCodeDetails() {
    this.ac.code = this.accessCodeDetails.get('code').value;
    this.ac.id = this.accessCodeDetails.get('id').value;
    this.ac.description = this.accessCodeDetails.get('description').value;
    this.ac.max_users = this.accessCodeDetails.get('max_users').value;
    this.ac.allowed_domains = this.accessCodeDetails.get('allowed_domains').value;
    if (this.ac.allowed_domains.includes("\n") || this.accessCodeDetails.get('allowed_domains').value != "") {
        this.ac.allowed_domains = this.accessCodeDetails.get('allowed_domains').value.split("\n");
    }
    this.ac.scenarios = this.accessCodeDetails.get('scenarios').value;
    this.ac.courses = this.accessCodeDetails.get('courses').value;
    this.ac.restricted_bind = this.accessCodeDetails.get('restricted_bind').value;
    this.ac.restricted_bind_value = this.accessCodeDetails.get('restricted_bind_value').value;
  }

  public saveAccessCode() {
    if (this.updateAc) {
      this.ac.code = this.updateAc.code;
      this.acService.update(this.ac)
        .subscribe(
          (s: ServerResponse) => {
            this.event.next(true);
          }
        )
    } else {
      this.acService.add(this.ac)
        .subscribe(
          (s: ServerResponse) => {
            this.event.next(true);
          }
        )
    }
  }
}
