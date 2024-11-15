import { FormLoginComponent } from './pages/form-login/form-login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NotAllowedComponent } from './pages/not-allowed/not-allowed.component';
import { Role } from './interfaces/roles.enum';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { authGuard } from './auth/auth.guard';
import { UsersComponent } from './pages/users/users.component';
import { UsersCreateComponent } from './pages/users-create/users-create.component';
import { UsersDetailComponent } from './pages/users-detail/users-detail.component';
import { UsersEditComponent } from './pages/users-edit/users-edit.component';
import { ResidentsComponent } from './pages/residents/residents.component';
import { ResidentsDetailComponent } from './pages/residents-detail/residents-detail.component';
import { ResidentsCreateComponent } from './pages/residents-create/residents-create.component';
import { ResidentsEditComponent } from './pages/residents-edit/residents-edit.component';
import { HealthReportComponent } from './pages/healthreport/healthreport.component';
import { HealthReportDetailComponent } from './pages/healthreport-detail/healthreport-detail.component';
import { HealthReportCreateComponent } from './pages/healthreport-create/healthreport-create.component';
import { HealthReportEditComponent } from './pages/healthreport-edit/healthreport-edit.component';
import { Routes } from '@angular/router';


export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'login', component: FormLoginComponent},
  {
    path: 'residents',
    component: ResidentsComponent,
    // canActivate: [authGuard],
    // data: {roles: [Role.Admin, Role.Manager, Role.Caretaker]}
  },
  {
    path: 'residents/detail/:id',
    component: ResidentsDetailComponent,
  },
  {
    path: 'residents/create',
    component: ResidentsCreateComponent,
  },
  {
    path: 'residents/edit',
    component: ResidentsEditComponent,
  },

  {
    path: 'healthreport',
    component: HealthReportComponent,
    // canActivate: [authGuard],
    // data: {roles: [Role.Admin, Role.Manager, Role.Caretaker]}
  },
  {
    path: 'healthreport/detail/:id',
    component: HealthReportDetailComponent,
  },
  {
    path: 'healthreport/create',
    component: HealthReportCreateComponent,
  },
  {
    path: 'healthreport/edit',
    component: HealthReportEditComponent,
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: {roles: [Role.Admin, Role.Manager, Role.Caretaker, Role.Relative]}
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'users/detail/:id',
    component: UsersDetailComponent,
  },
  {
    path: 'users/create',
    component: UsersCreateComponent,
  },
  {
    path: 'residents/:residentId/medications',
    component: MedicationComponent,
    // canActivate: [authGuard],
    // data: {roles: [Role.Admin, Role.Manager, Role.Caretaker]}
  },
  {
    path: 'users/:id/edit',
    component: UsersEditComponent,
  },
  { path: 'forbidden', component: NotAllowedComponent },
  { path: '**', pathMatch: 'full', component: NotFoundComponent },
  {
    path: 'residents/:residentId/medications',
    component: MedicationComponent,
    // canActivate: [authGuard],
    // data: {roles: [Role.Admin, Role.Manager, Role.Caretaker]}
  },
  {path: 'forbidden', component: NotAllowedComponent},
  {path: '**', pathMatch: "full", component: NotFoundComponent}
];
