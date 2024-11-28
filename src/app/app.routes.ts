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
import { MedicationComponent } from './pages/medication/medication.component';
import { ResidentsAppointmentsComponent } from './pages/residents-appointments/residents-appointments.component';
import {MedicationCreateComponent} from './pages/medication-create/medication-create.component';
import {MedicationDetailsComponent} from './pages/medication-details/medication-details.component';
import {
  ResidentsAppointmentsCreateComponent
} from './pages/residents-appointments-create/residents-appointments-create.component';
import {
  ResidentsAppointmentsDetailComponent
} from './pages/residents-appointments-detail/residents-appointments-detail.component';
import {
  ResidentsAppointmentsEditComponent
} from './pages/residents-appointments-edit/residents-appointments-edit.component';


export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'login', component: FormLoginComponent},

  {
    path: 'residents/:residentId/appointments/create',
    component:ResidentsAppointmentsCreateComponent,
  },

  {
    path: 'residents/:residentId/appointments/:appointmentId/edit',
    component: ResidentsAppointmentsEditComponent,
  },
  {
    path: 'residents/:residentId/appointments/:id',
    component: ResidentsAppointmentsDetailComponent,
  },

  {
    path: 'residents/:residentId/appointments',
    component: ResidentsAppointmentsComponent,

  },
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
    path: 'residents/:id/edit',
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
    data: {roles: [ Role.Manager, Role.Caretaker, Role.Relative]}
    // Role.Admin
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
    path: 'users/:id/edit',
    component: UsersEditComponent,
  },
  {
    path: 'residents/:residentId/medicaments',
    component: MedicationComponent,
    // canActivate: [authGuard],
    // data: {roles: [Role.Admin, Role.Manager, Role.Caretaker]}
  },
  {
    path: 'residents/:residentId/medicaments/create',
    component: MedicationCreateComponent,
    // canActivate: [authGuard],
    // data: {roles: [Role.Admin, Role.Manager]}
  },
  {
    path: 'residents/:residentId/medicaments/:id/edit',
    component: MedicationCreateComponent,
    // canActivate: [authGuard],
    // data: {roles: [Role.Admin, Role.Manager]}
  },
  {
    path: 'residents/:residentId/medicaments/:id',
    component: MedicationDetailsComponent,
  },

  {path: 'forbidden', component: NotAllowedComponent},
  {path: '**', pathMatch: "full", component: NotFoundComponent}
];
