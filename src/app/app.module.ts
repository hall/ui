import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
import { AccessCodesComponent } from './admin/configuration/accesscodes/accesscodes.component';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminComponent } from './admin/admin/admin.component';
import { AngularSplitModule } from 'angular-split';
import { AppComponent } from './app.component';
import { AppConfigService } from './app-config.service';
import { AppRoutingModule } from './app-routing.module';
import { DragulaModule } from 'ng2-dragula';
import { ArraySortPipe } from './utils/sort.component';
import { AtobPipe } from './atob.pipe';
import { AuthGuard } from './auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
import { ConfigurationComponent } from './admin/configuration/configuration.component';
import { CourseComponent } from './admin/course/course.component';
import { CourseService } from './data/course.service';
import { CtrComponent } from './ctr/ctr.component';
import { CtrService } from './services/ctr.service';
import { DlDateTimeDateModule, DlDateTimePickerModule} from 'angular-bootstrap-datetimepicker';
import { DynamicHTMLModule } from './dynamic-html';
import { EditAccessCodeComponent } from './admin/configuration/accesscodes/edit-accesscode/edit-accesscode.component';
import { EditEnvironmentComponent } from './admin/configuration/environments/edit-environment/edit-environment.component';
import { EnvironmentsComponent } from './admin/configuration/environments/environments.component';
import { EventComponent } from './admin/event/event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { LoginComponent } from './login/login.component';
import { MarkdownModule } from 'ngx-markdown';
import { NewScheduledEventComponent } from './admin/event/new-scheduled-event/new-scheduled-event.component';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RootComponent } from './root.component';
import { ScenarioCard } from './scenariocard/scenariocard.component';
import { SessionComponent } from './session/session.component';
import { ScenarioService } from './services/scenario.service';
import { ScenariosComponent } from './admin/scenarios/scenarios.component';
import { SessionService } from './services/session.service';
import { StepComponent } from './step/step.component';
import { StepService } from './services/step.service';
import { TerminalComponent } from './terminal/terminal.component';
import { UserComponent } from './admin/user/user.component';
import { VMClaimComponent } from './vmclaim/vmclaim.component';
import { VMClaimService } from './services/vmclaim.service';
import { VMInfoComponent } from './vminfo/vminfo.component';
import { VMInfoService } from './vminfo/vminfo.service';
import { VMService } from './services/vm.service';
import { environment } from 'src/environments/environment';
import { ScenarioComponent } from './admin/scenario/scenario.component';
import { KeepaliveValidator } from './admin/validators/keepalive.validator';
import { DeleteConfirmationComponent } from './admin/delete-confirmation/delete-confirmation.component';
import { AddScenarioComponent } from './admin/course/add-scenario/add-scenario.component';
import { NewCourseComponent } from './admin/course/new-course/new-course.component';
import { ContentComponent } from './admin/content/content.component';
import { CourseFormComponent } from './admin/course/course-form/course-form.component';
import { AdminRootComponent } from './admin/root/root.component';
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
    ScenariosComponent,
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
