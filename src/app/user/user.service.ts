import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap, catchError } from 'rxjs/operators';
import { ServerResponse } from '../utils/server-response';
import { of, throwError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _acModified : BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    public http: HttpClient
  ) { }

  public getModifiedObservable() {
    return this._acModified.asObservable();
  }

  public changepassword(oldPassword: string, newPassword: string) {
    var params = new HttpParams()
    .set("old_password", oldPassword)
    .set("new_password", newPassword);

    return this.http.post<ServerResponse>(environment.server + "/auth/changepassword", params)
    .pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(e.error);
      })
    )
  }

  public getUsers() {
    return this.http.get(`${environment.server}/users`)
    .pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atob(s.content)));
      }),
      catchError((e: HttpErrorResponse) => {
        return throwError(e.error);
      })
    )
  }

  public saveUser(id: string, email: string = "", password: string = "", admin: boolean = null, accesscodes: string[] = null)  {
    var params = new HttpParams()
    .set("id", id)
    .set("email", email)
    .set("password", password);

    if (admin != null) {
      params = params.set("admin", JSON.stringify(admin));
    }

    if (accesscodes != null) {
      params = params.set("accesscodes", JSON.stringify(accesscodes));
    }

    return this.http.put(`${environment.server}/users`, params)
    .pipe(
      catchError((e: HttpErrorResponse) => {
        return of(e.error);
      })
    )
  }

  public getAccessCodes() {
    return this.http.get(environment.server + "/auth/accesscode")
    .pipe(
      switchMap((s: ServerResponse) => {
        return of(JSON.parse(atob(s.content)))
      }),
      catchError((e: HttpErrorResponse) => {
        return throwError(e.error);
      })
    )
  }

  public addAccessCode(a: string) {
    var params = new HttpParams()
    .set("access_code", a);
    this._acModified.next(true);
    return this.http.post<ServerResponse>(environment.server + "/auth/accesscode", params)
    .pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(e.error);
      })
    )
  }

  public deleteAccessCode(a: string) {
    this._acModified.next(true);
    return this.http.delete<ServerResponse>(environment.server + "/auth/accesscode/" + a)
    .pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(e.error);
      })
    )
  }

}
