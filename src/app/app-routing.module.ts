import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AppComponent } from './app.component';
import { SessionComponent } from './session/session.component';
import { TerminalComponent } from './terminal/terminal.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { StepComponent } from './step/step.component';
import { EventComponent } from './event/event.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { EnvironmentsComponent } from './environment/environments.component';
import { AccessCodesComponent } from './accesscodes/accesscodes.component';
import { ContentComponent } from './content/content.component';
import { CourseComponent } from './course/course.component';
import { ScenarioComponent } from './scenario/scenario.component';
import { AdminRootComponent } from './root/root.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppComponent,
    canActivate: [
      AuthGuard
    ],
    children: [
      { path: '', component: HomeComponent },
      // {
      //   path: 'scenario/:scenario',
      //   component: ScenarioComponent
      // },
      {
        path: 'course/:course/scenario/:scenario',
        component: SessionComponent
      },
      {
        path: 'session/:session/steps/:step',
        component: StepComponent,
        canDeactivate: ['canDeactivateSession']
      },
      {
        path: 'terminal',
        component: TerminalComponent
      },
      {
        path: 'admin',
        component: AdminRootComponent,
        canActivate: [AuthGuard],
        data: { admin: true },
        children: [
          {
            path: '',
            component: AdminComponent
          },
          {
            path: 'events',
            component: EventComponent
          },
          {
            path: 'content',
            component: ContentComponent,
            children: [
              {
                path: 'scenarios',
                component: ScenarioComponent
              },
              {
                path: 'courses',
                component: CourseComponent
              }
            ]
          },
          {
            path: 'users',
            component: UserComponent
          },
          {
            path: 'configuration',
            component: ConfigurationComponent,
            children: [
              {
                path: 'environments',
                component: EnvironmentsComponent
              },
              {
                path: 'accesscodes',
                component: AccessCodesComponent
              }
            ]
          }
        ]
      },
    ]
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule]
})
export class AppRoutingModule { }
