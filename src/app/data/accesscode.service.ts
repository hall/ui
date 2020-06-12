import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ServerResponse } from './serverresponse';
import { formatDate } from '@angular/common';
import { AccessCode } from './accesscode';
import { Utils } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class AccessCodeService {

  constructor(
    public http: HttpClient,
    public utils: Utils
  ) { }

  public list() {
    return this.http.get(environment.server + "/a/accesscodes")
    .pipe(
      map((s: ServerResponse) => JSON.parse(atob(s.content)))
    )
  }

  public add(ac: AccessCode) {
    return this.http.post(environment.server + "/a/accesscodes", this.utils.params(ac))
  }

  public update(ac: AccessCode) {
    return this.http.put(environment.server + "/a/accesscodes/" + ac.id, this.utils.params(ac));
  }

  public delete(ac: string) {
    return this.http.delete(environment.server + "/a/accesscodes/" + ac);
  }
}
