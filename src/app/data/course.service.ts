import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServerResponse } from './serverresponse';
import { map } from 'rxjs/operators';
import { Course } from './course';
import { Scenario } from './scenario';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(
    public http: HttpClient
  ) { }

  public list(param?) {
    return this.http.get(`${environment.server}/courses${param ? "?role=" + param : ""}`)
    .pipe(
      map((s: ServerResponse) => {
        let obj: Course[] = JSON.parse(atob(s.content)); // this doesn't encode a map though
        // so now we need to go vmset-by-vmset and build maps
        if (obj == null) { return []; }
        obj.forEach((c: Course) => {
          if (c.virtualmachines) {
            c.virtualmachines.forEach((v: Object) => {
              v = new Map(Object.entries(v))
            })
          }
          if (c.scenarios) {
            c.scenarios.forEach((s) => {
              s.name = atob(s.name)
              s.description = atob(s.description)
            });
            c.scenarios = c.scenarios.filter(x => typeof x != 'string');
            c.scenarios.sort(function (a, b) { return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0); });
          }
        });
        return obj;
      }),
      map((cList: Course[]) => {
        cList.forEach((c: Course) => {
          c.name = atob(c.name);
          c.description = atob(c.description);
        });
        return cList;
      })
    )
  }

  public create(c: Course) {
    var params = new HttpParams()
    .set("name", btoa(c.name))
    .set("description", btoa(c.description))
    .set("keepalive_duration", c.keepalive_duration)
    .set("pause_duration", JSON.stringify(c.pause_duration))

    return this.http.post(`${environment.server}/courses`, params)
  }

  public update(c: Course) {
    var scenarioArray: string[] = [];
    c.scenarios.forEach((s: Scenario) => {
      scenarioArray.push(s.id);
    });
    var params = new HttpParams()
    .set("name", btoa(c.name))
    .set("description", btoa(c.description))
    .set("keepalive_duration", c.keepalive_duration)
    .set("pause_duration", JSON.stringify(c.pause_duration))
    .set("virtualmachines", JSON.stringify(c.virtualmachines))
    .set("scenarios", JSON.stringify(scenarioArray));

    return this.http.put(`${environment.server}/courses/${c.id}`, params)
  }

  public delete(c: Course) {
    return this.http.delete(`${environment.server}/courses/${c.id}`)
  }

}
