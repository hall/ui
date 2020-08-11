import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Scenario } from '../scenario/scenario';
import { ServerResponse } from '../utils/server-response';
import { environment } from 'src/environments/environment';

@Component({
    templateUrl: 'scenariocard.component.html',
    selector: 'scenario-card'
})
export class ScenarioCard implements OnInit {
    @Input()
    public scenario: Scenario = new Scenario();
    @Input()
    public courseid: string = "";
    @Output()
    scenarioModal = new EventEmitter();


    constructor() {
    }

    ngOnInit() {
    }

    navScenario() {
       this.scenarioModal.emit({s:this.scenario.id,c:this.courseid});
    }
}
