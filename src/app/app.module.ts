import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RootComponent } from './root.component';
import { HomeComponent } from './home.component';
import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
import { CourseComponent } from './course/course.component';
import { ScenarioComponent } from './scenario/scenario.component';
import { TerminalComponent } from './terminal/terminal.component';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './auth.guard';
import { ScenarioCard } from './scenariocard/scenariocard.component';
import { StepComponent } from './step/step.component';
import { VMClaimComponent } from './vmclaim/vmclaim.component';
import { AtobPipe } from './atob.pipe';
import { MarkdownModule } from 'ngx-markdown';
import { DynamicHTMLModule } from './dynamic-html';
import { CtrComponent } from './ctr/ctr.component';
import { VMInfoComponent } from './vminfo/vminfo.component';
import { CtrService } from './services/ctr.service';
import { VMInfoService } from './vminfo/vminfo.service';
import { ScenarioService } from './services/scenario.service';
import { CourseService } from './services/course.service';
import { SessionService } from './services/session.service';
import { StepService } from './services/step.service';
import { VMService } from './services/vm.service';
import { VMClaimService } from './services/vmclaim.service';
import { environment } from 'src/environments/environment';
import { AppConfigService } from './app-config.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export function tokenGetter() {
  return localStorage.getItem("hobbyfarm_token");
}

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

export function jwtOptionsFactory() {
  return {
    tokenGetter: tokenGetter,
    whitelistedDomains: [
      environment.server.replace(/(^\w+:|^)\/\//, ''),
    ],
    blacklistedRoutes: [
      environment.server.replace(/(^\w+:|^)\/\//, '') + "/auth/authenticate"
    ],
    skipWhenExpired: true
  }
}

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    HomeComponent,
    CourseComponent,
    ScenarioComponent,
    TerminalComponent,
    LoginComponent,
    ScenarioCard,
    StepComponent,
    CtrComponent,
    VMInfoComponent,
    VMClaimComponent,
    AtobPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    DynamicHTMLModule.forRoot({
      components: [
        { component: CtrComponent, selector: 'ctr' },
        { component: VMInfoComponent, selector: 'vminfo' }
      ]
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    }),
  ],
  providers: [
    AppComponent,
    AuthGuard,
    CtrService,
    VMInfoService,
    CourseService,
    ScenarioService,
    SessionService,
    StepService,
    VMService,
    VMClaimService,
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    },
    {
      provide: 'canDeactivateSession',
      useValue: (
        component: StepComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
        ) => {
          if (! nextState.url.includes("/session/")) {
            component.stopKeepalive()
          }
          return true
        }
    }
  ],
  bootstrap: [RootComponent]
})
export class AppModule {

}
