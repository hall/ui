import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { ServerResponse } from '../utils/server-response';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VmtemplateService {

  constructor(
    public http: HttpClient
  ) { }

  public list() {
    return this.http.get(`${environment.server}/vmtemplate`)
    .pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atob(s.content)))
      })
    )
  }
}
