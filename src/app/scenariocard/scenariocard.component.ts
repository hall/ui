import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Scenario } from '../scenario/Scenario';
import { Router } from '@angular/router';
import { ServerResponse } from '../ServerResponse';
import { environment } from 'src/environments/environment';
import { Course } from '../course/course';
import { CourseService } from '../services/course.service';

@Component({
    templateUrl: 'scenariocard.component.html',
    selector: 'scenario-card'
})
export class ScenarioCard implements OnInit {
    @Input()
    public scenarioid: string = "";
    @Input()
    public course: Course = new Course();
    @Output()
    scenarioModal = new EventEmitter<string>();

    public scenario: Scenario = new Scenario();
    public error: string = "";

    constructor(
        public http: HttpClient,
        public router: Router,
        public courseService: CourseService,
    ) {
    }

    ngOnInit() {
        this.error = "";
        this.http.get(environment.server + "/scenario/" + this.scenarioid)
        .subscribe(
            (s: ServerResponse) => {
                this.scenario = JSON.parse(atob(s.content));
            },
            (e: HttpErrorResponse) => {
                this.error = e.error;
            }
        )
    }

    navScenario() {
       this.scenarioModal.emit(this.scenarioid);
    }
}
