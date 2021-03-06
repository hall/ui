import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
import { AccessCodesComponent } from './accesscodes/accesscodes.component';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AddScenarioComponent } from './course/add-scenario/add-scenario.component';
import { AdminComponent } from './admin/admin.component';
import { AdminRootComponent } from './root/root.component';
import { AngularSplitModule } from 'angular-split';
import { AppComponent } from './app.component';
import { AppConfigService } from './app-config.service';
import { AppRoutingModule } from './app-routing.module';
import { ArraySortPipe } from './utils/sort.component';
import { AtobPipe } from './atob.pipe';
import { AuthGuard } from './auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ContentComponent } from './content/content.component';
import { CourseComponent } from './course/course.component';
import { CourseFormComponent } from './course/course-form/course-form.component';
import { CourseService } from './course/course.service';
import { CtrComponent } from './ctr/ctr.component';
import { CtrService } from './ctr/ctr.service';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { DlDateTimeDateModule, DlDateTimePickerModule} from 'angular-bootstrap-datetimepicker';
import { DragulaModule } from 'ng2-dragula';
import { DynamicHTMLModule } from './dynamic-html';
import { EditAccessCodeComponent } from './accesscodes/edit-accesscode/edit-accesscode.component';
import { EditEnvironmentComponent } from './environment/edit-environment/edit-environment.component';
import { EnvironmentsComponent } from './environment/environments.component';
import { EventComponent } from './event/event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { KeepaliveValidator } from './utils/keepalive.validator';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { LoginComponent } from './login/login.component';
import { MarkdownModule } from 'ngx-markdown';
import { NewCourseComponent } from './course/new-course/new-course.component';
import { NewScheduledEventComponent } from './event/new-scheduled-event/new-scheduled-event.component';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RootComponent } from './root.component';
import { ScenarioCard } from './scenariocard/scenariocard.component';
import { ScenarioComponent } from './scenario/scenario.component';
import { ScenarioService } from './scenario/scenario.service';
import { SessionComponent } from './session/session.component';
import { SessionService } from './session/session.service';
import { StepComponent } from './step/step.component';
import { StepService } from './step/step.service';
import { TerminalComponent } from './terminal/terminal.component';
import { UserComponent } from './user/user.component';
import { Utils } from './utils/utils.service';
import { VMClaimComponent } from './vmclaim/vmclaim.component';
import { VMClaimService } from './vmclaim/vmclaim.service';
import { VMInfoComponent } from './vminfo/vminfo.component';
import { VMInfoService } from './vminfo/vminfo.service';
import { VMService } from './vm/vm.service';
import { environment } from 'src/environments/environment';
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
    AccessCodesComponent,
    AddScenarioComponent,
    AdminComponent,
    AdminRootComponent,
    AppComponent,
    ArraySortPipe,
    AtobPipe,
    ConfigurationComponent,
    ContentComponent,
    CourseComponent,
    CourseFormComponent,
    CtrComponent,
    DeleteConfirmationComponent,
    EditAccessCodeComponent,
    EditEnvironmentComponent,
    EnvironmentsComponent,
    EventComponent,
    HomeComponent,
    LoginComponent,
    NewCourseComponent,
    NewScheduledEventComponent,
    RootComponent,
    ScenarioCard,
    ScenarioComponent,
    SessionComponent,
    StepComponent,
    TerminalComponent,
    UserComponent,
    VMClaimComponent,
    VMInfoComponent,
  ],
  imports: [
    AngularSplitModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ClarityModule,
    DlDateTimeDateModule,
    DlDateTimePickerModule,
    FormsModule,
    HttpClientModule,
    LMarkdownEditorModule,
    MarkdownModule.forRoot(),
    DragulaModule.forRoot(),
    ReactiveFormsModule,
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
    AdminComponent,
    AppComponent,
    AppConfigService,
    AuthGuard,
    CourseService,
    CtrService,
    ScenarioService,
    SessionService,
    StepService,
    Utils,
    VMClaimService,
    VMInfoService,
    VMService,
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
export class AppModule {}
