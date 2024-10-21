import {Routes} from '@angular/router';
import {FormLoginComponent} from './pages/form-login/form-login.component';
import {UsersTableComponent} from './components/users-table/users-table.component';
import {ResidentsTableComponent} from './components/residents-table/residents-table.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {NotAllowedComponent} from './pages/not-allowed/not-allowed.component';
import {AuthGuard} from './auth.guard';
import {Role} from './interfaces/roles.enum';

export const routes: Routes = [
  {path: 'login', component: FormLoginComponent},
  {
    path: 'users',
    component: UsersTableComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Admin, Role.Manager]}
  },
  {
    path: 'residents',
    component: ResidentsTableComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Admin, Role.Manager, Role.Caretaker]}
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Admin, Role.Manager, Role.Caretaker, Role.Relative]}
  },
  {path: 'forbidden', component: NotAllowedComponent},
  {path: '**', pathMatch: "full", component: NotFoundComponent}
];
