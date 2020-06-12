import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AppComponent } from './app.component';
import { ScenarioComponent } from './scenario/scenario.component';
import { TerminalComponent } from './terminal/terminal.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { StepComponent } from './step/step.component';
import { EventComponent } from './admin/event/event.component';
import { UserComponent } from './admin/user/user.component';
import { AdminComponent } from './admin/admin/admin.component';
import { ScenariosComponent } from './admin/scenarios/scenarios.component';
import { ConfigurationComponent } from './admin/configuration/configuration.component';
import { EnvironmentsComponent } from './admin/configuration/environments/environments.component';
import { AccessCodesComponent } from './admin/configuration/accesscodes/accesscodes.component';

const routes: Routes = [
  {path: '', redirectTo: '/app/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {
    path: 'app',
    component: AppComponent,
    canActivate: [
      AuthGuard
    ],
    children: [
      {path: 'home', component: HomeComponent},
      {
        path: 'scenario/:scenario',
        component: ScenarioComponent
      },
      {
        path: 'course/:course/scenario/:scenario',
        component: ScenarioComponent
      },
      {
        path: 'session/:session/steps/:step',
        component: StepComponent,
        canDeactivate: ['canDeactivateSession']
      },
      {path: 'terminal', component: TerminalComponent}
    ]
  },
  {path: '**', redirectTo: '/app/home'},
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'events',
    component: EventComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'scenarios',
    component: ScenariosComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'users',
    component: UserComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
    canActivate: [
      AuthGuard
    ],
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
