import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { VMInfoConfig } from './vminfo-config';
import { ReplaySubject, Subject } from 'rxjs';


@Injectable()
export class VMInfoService {
    private configStream: ReplaySubject<VMInfoConfig> = new ReplaySubject();

    constructor(
    ) {
    }

    public generateId() {
        return Guid.create().toString();
    }

    public setConfig(config: VMInfoConfig) {
        this.configStream.next(config);
    }

    public getConfigStream() {
        return this.configStream.asObservable();
    }

}
