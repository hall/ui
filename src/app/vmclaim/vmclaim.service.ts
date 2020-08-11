import { Injectable } from '@angular/core';
import { VMClaim } from './vmclaim';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { ServerResponse } from '../utils/server-response';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class VMClaimService {
    private cachedVmClaims: Map<string, VMClaim> = new Map<string, VMClaim>();

    constructor(
        private http: HttpClient
    ) {
    }

    public get(id: string): Observable<VMClaim> {
        return this.http.get(`${environment.server}/vmclaims/${id}`)
            .pipe(
                map((s: ServerResponse) => {
                    return JSON.parse(atob(s.content));
                }),
                tap((v: VMClaim) => {
                    this.cachedVmClaims.set(v.id, v);
                })
            )
    }
}
