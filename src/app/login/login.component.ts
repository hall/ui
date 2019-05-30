import { Component } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './User';
import { ServerResponse } from '../ServerResponse';

@Component({
    templateUrl: './login.component.html',
    selector: 'login',
    styleUrls: [
        "./login.component.css"
    ],
})

export class LoginComponent {
    private email: string = "";
    private password: string = "";
    private error: string = "";
    private success: string = "";
    private accesscode: string = "";

    private loginactive: boolean = false;
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
    }

    public register() {
        this.error = "";
        let body = new HttpParams()
            .set("email", this.email)
            .set("password", this.password)
            .set("access_code", this.accesscode);

        this.http.post("http://localhost/auth/registerwithaccesscode", body)
            .subscribe(
                (s: ServerResponse) => {
                    this.success = "Success! User created. Please login.";
                    this.loginactive = true;
                },
                (e: HttpErrorResponse) => {
                    if (e.error instanceof ErrorEvent) {
                        // frontend, maybe network?
                        this.error = e.error.error;
                    } else {
                        // backend
                        this.error = e.error.message;
                    }
                }
            )
    }

    public login() {
        this.error = "";
        let body = new HttpParams()
            .set("email", this.email)
            .set("password", this.password);

        this.http.post("http://localhost/auth/authenticate", body)
            .subscribe(
                (s: ServerResponse) => {
                    // should have a token here
                    // persist it
                    localStorage.setItem("hobbyfarm_token", s.message) // not b64 from authenticate

                    // redirect to the scenarios page
                    this.router.navigateByUrl("/app/home")
                },
                (e: HttpErrorResponse) => {
                    if (e.error instanceof ErrorEvent) {
                        // frontend, maybe network?
                        this.error = e.error.error;
                    } else {
                        // backend
                        this.error = e.error.message;
                    }
                }
            )
    }
}