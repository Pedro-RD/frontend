import {Routes} from '@angular/router';
import {FormLoginComponent} from './pages/form-login/form-login.component';
import {UsersTableComponent} from './components/users-table/users-table.component';
import {ResidentsTableComponent} from './components/residents-table/residents-table.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {path: 'login', component: FormLoginComponent},
  {path: 'users', component: UsersTableComponent},
  {path: 'residents', component: ResidentsTableComponent},
  {path: 'dashboard', component: DashboardComponent},
];
