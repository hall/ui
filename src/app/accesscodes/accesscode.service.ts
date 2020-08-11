import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ServerResponse } from '../utils/server-response';
import { AccessCode } from './accesscode';
import { Utils } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AccessCodeService {

  constructor(
    public http: HttpClient,
    public utils: Utils
  ) { }

  public list() {
    return this.http.get(`${environment.server}/accesscodes`)
    .pipe(
      map((s: ServerResponse) => JSON.parse(atob(s.content)))
    )
  }

  public add(ac: AccessCode) {
    return this.http.post(`${environment.server}/accesscodes`, this.utils.params(ac))
  }

  public update(ac: AccessCode) {
    return this.http.put(`${environment.server}/accesscodes/${ac.id}`, this.utils.params(ac));
  }

  public delete(ac: string) {
    return this.http.delete(`${environment.server}/accesscodes/${ac}`);
  }
}
