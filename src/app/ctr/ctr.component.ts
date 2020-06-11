import {  Component } from '@angular/core';
import { CtrService } from '../services/ctr.service';
import { OnMount } from '../dynamic-html';

@Component({
    selector: 'ctr',
    template:  `
        <pre>{{code}}</pre>
        <i (click)="ctr()"><clr-icon shape="caret right"></clr-icon> Click to run on {{target}}</i>
    `,
    styleUrls: ['ctr.component.scss']
})
export class CtrComponent implements OnMount {
    public id: string = "";

    public code: string = "";
    public target: string = "";

    constructor(
        public ctrService: CtrService
    ) {
    }

    public dynamicOnMount(attrs?: Map<string, string>, content?: string, element?: Element) {
        this.id = attrs.get("ctrid");
        this.code = this.ctrService.getCode(this.id);
        this.target = this.ctrService.getTarget(this.id);
    }

    public ctr() {
        this.ctrService.sendCode({target: this.target, code: this.code});
    }
}
