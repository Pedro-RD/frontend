import { Routes } from '@angular/router';
import { FormLoginComponent } from './pages/form-login/form-login.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { ResidentsTableComponent } from './components/residents-table/residents-table.component';
import { FormUsersComponent } from './pages/form-users/form-users.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NotAllowedComponent } from './pages/not-allowed/not-allowed.component';
import { Role } from './interfaces/roles.enum';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: FormLoginComponent },
  {
    path: 'users',
    component: UsersTableComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Admin, Role.Manager] }
  },
  { path: 'users/form', component: FormUsersComponent },
  {
    path: 'residents',
    component: ResidentsTableComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Admin, Role.Manager, Role.Caretaker] }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Admin, Role.Manager, Role.Caretaker, Role.Relative] }
  },
  { path: 'forbidden', component: NotAllowedComponent },
  { path: '**', pathMatch: "full", component: NotFoundComponent }
];
