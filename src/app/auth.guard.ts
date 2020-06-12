import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private helper: JwtHelperService
    ){}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
            if (this.helper.isTokenExpired() || !this.helper.tokenGetter()) {
                this.router.navigateByUrl("/login")
            } else {
                return true;
            }
        }
}
