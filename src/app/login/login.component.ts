import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ServerResponse } from '../utils/server-response';
import { environment } from 'src/environments/environment';
import { AppConfigService } from '../app-config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ClrModal } from '@clr/angular';

@Component({
    templateUrl: './login.component.html',
    selector: 'login',
    styleUrls: [
        "./login.component.css"
    ],
})

export class LoginComponent {
    public email: string = "";
    public password: string = "";
    public error: string = "";
    public success: string = "";
    public accesscode: string = "";
    public eulaModalOpened: boolean = false;

    private Config = this.config.getConfig();
    public logo;
    public eula;
    public eulaAnwser;
    public background;

    public loginactive: boolean = false;
    constructor(
        public http: HttpClient,
        public router: Router,
        public config: AppConfigService,
        private _sanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef
    ) {
        if (this.Config.login && this.Config.login.logo) {
          this.logo = this._sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + this.Config.login.logo)
        } else {
          this.logo = "/assets/rancher-labs-stacked-color.svg";
        }
        if (this.Config.login && this.Config.login.background) {
          this.background = this._sanitizer.bypassSecurityTrustStyle('url(data:image/png;base64,' + this.Config.login.background + ')');
        } else {
          this.background = "url(/assets/login_container_farm.svg)";
        }

        if (this.Config.eula) {
          this.eula = atob(this.Config.eula);
        }
    }

    @ViewChild("eulamodal", { static: true }) eulaModal: ClrModal;

    public agreeToEula(agree: boolean) {
        if (agree) {
          this.eulaAnwser = true
          this.actuallyRegister()
        } else {
          this.eulaAnwser = false
          this.error = "you must agree to the EULA to use this system"
        }
        this.eulaModalOpened = false
    }

    public register() {

        if (this.eula != null && this.eulaAnwser != true) {
          this.eulaModal.open();
          this.cdr.detectChanges();
        } else {
          this.actuallyRegister();
        }

    }

    public actuallyRegister() {
        this.error = "";
        let body = new HttpParams()
            .set("email", this.email)
            .set("password", this.password)
            .set("access_code", this.accesscode);

        this.http.post(environment.server + "/auth/registerwithaccesscode", body)
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

        this.http.post(environment.server + "/auth/authenticate", body)
            .subscribe(
                (s: ServerResponse) => {
                    // should have a token here
                    // persist it
                    localStorage.setItem("hobbyfarm_token", s.message) // not b64 from authenticate

                    // redirect to the scenarios page
                    this.router.navigateByUrl("/")
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
