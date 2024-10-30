import {Routes} from '@angular/router';
import {FormLoginComponent} from './pages/form-login/form-login.component';
import {ResidentsTableComponent} from './components/old/residents-table/residents-table.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {NotAllowedComponent} from './pages/not-allowed/not-allowed.component';
import {Role} from './interfaces/roles.enum';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {authGuard} from './auth/auth.guard';
import {UsersComponent} from './pages/users/users.component';
import {UsersCreateComponent} from './pages/users-create/users-create.component';
import {UsersDetailComponent} from './pages/users-detail/users-detail.component';

export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'login', component: FormLoginComponent},
  {
    path: 'residents',
    component: ResidentsTableComponent,
    canActivate: [authGuard],
    data: {roles: [Role.Admin, Role.Manager, Role.Caretaker]}
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
  {path: 'forbidden', component: NotAllowedComponent},
  {path: '**', pathMatch: "full", component: NotFoundComponent}
];
