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
import { HealthReportComponent } from './pages/health-report/health-report.component';
import { MessageComponent } from './pages/message/message.component';
import { HealthReportDetailComponent } from './pages/health-report-detail/health-report-detail.component';
import { HealthReportCreateComponent } from './pages/health-report-create/health-report-create.component';
import { HealthReportEditComponent } from './pages/health-report-edit/health-report-edit.component';
import { Routes } from '@angular/router';
import { MedicationComponent } from './pages/medication/medication.component';
import { ResidentsAppointmentsComponent } from './pages/residents-appointments/residents-appointments.component';
import { MedicationCreateComponent } from './pages/medication-create/medication-create.component';
import { MedicationDetailsComponent } from './pages/medication-details/medication-details.component';
import { MedicationAdministrationComponent } from './pages/medication-administration/medication-administration.component';

import { ResidentsAppointmentsCreateComponent } from './pages/residents-appointments-create/residents-appointments-create.component';
import { ResidentsAppointmentsDetailComponent } from './pages/residents-appointments-detail/residents-appointments-detail.component';
import { ResidentsAppointmentsEditComponent } from './pages/residents-appointments-edit/residents-appointments-edit.component';
import { ResidentsPaymentsComponent } from './pages/residents-payments/residents-payments.component';
import { ResidentsPaymentsDetailsComponent } from './pages/residents-payments-details/residents-payments-details.component';
import { ResidentsPaymentsCreateComponent } from './pages/residents-payments-create/residents-payments-create.component';
import { ResidentsPaymentsEditComponent } from './pages/residents-payments-edit/residents-payments-edit.component';
import { MedicationEditComponent } from './pages/medication-edit/medication-edit.component';
import { EmployeesShiftsComponent } from './pages/employees-shifts/employees-shifts.component';
import { EmployeeShiftsManagementComponent } from './pages/employee-shifts-management/employee-shifts-management.component';
import { FormResetPasswordComponent } from './pages/form-reset-password/form-reset-password.component';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    title: 'Aconchego - Pagina inicial',
  },
  {
    path: 'login',
    component: FormLoginComponent,
    title: 'Aconchego - Iniciar sessão',
  },

  {
    path: 'users/:id/reset-password',
    component: FormResetPasswordComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Relative, Role.Manager, Role.Caretaker] },
    title: 'Aconchego - Redefinir palavra-passe',
  },

  {
    path: 'employees/:id/shifts',
    component: EmployeeShiftsManagementComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker] },
    title: 'Aconchego - Gestão de turnos',
  },

  {
    path: 'employees/:id/shifts',
    component: EmployeesShiftsComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker] },
    title: 'Aconchego - Turnos',
  },

  {
    path: 'residents/:residentId/payments/create',
    component: ResidentsPaymentsCreateComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager] },
    title: 'Aconchego - Adicionar pagamento',
  },

  {
    path: 'residents/:residentId/payments/:paymentId/edit',
    component: ResidentsPaymentsEditComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager] },
    title: 'Aconchego - Editar pagamento',
  },

  {
    path: 'residents/:residentId/payments/:id',
    component: ResidentsPaymentsDetailsComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager] },
    title: 'Aconchego - Detalhes do pagamento',
  },

  {
    path: 'residents/:residentId/payments',
    component: ResidentsPaymentsComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager] },
    title: 'Aconchego - Pagamentos',
  },

  {
    path: 'residents/:residentId/appointments/create',
    component: ResidentsAppointmentsCreateComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker] },
    title: 'Aconchego - Adicionar consulta',
  },
  {
    path: 'residents/:residentId/appointments/:appointmentId/edit',
    component: ResidentsAppointmentsEditComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker] },
    title: 'Aconchego - Editar consulta',
  },
  {
    path: 'residents/:residentId/appointments/:id',
    component: ResidentsAppointmentsDetailComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker, Role.Relative] },
    title: 'Aconchego - Detalhes da consulta',
  },
  {
    path: 'residents/:residentId/appointments',
    component: ResidentsAppointmentsComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker, Role.Relative] },
    title: 'Aconchego - Consultas',
  },
  {
    path: 'residents/:residentId/health-reports/create',
    component: HealthReportCreateComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker] },
    title: 'Aconchego - Adicionar relatório de saúde',
  },
  {
    path: 'residents/:residentId/health-reports/:reportId/edit',
    component: HealthReportEditComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker] },
    title: 'Aconchego - Editar relatório de saúde',
  },
  {
    path: 'residents/:residentId/health-reports/:id',
    component: HealthReportDetailComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker, Role.Relative] },
    title: 'Aconchego - Detalhes do relatório de saúde',
  },
  {
    path: 'residents/:residentId/health-reports',
    component: HealthReportComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker, Role.Relative] },
    title: 'Aconchego - Relatórios de saúde',
  },
  {
    path: 'residents/:residentId/messages',
    component: MessageComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Relative, Role.Manager, Role.Caretaker] },
    title: 'Aconchego - Mensagens',
  },
  {
    path: 'residents',
    component: ResidentsComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker] },
    title: 'Aconchego - Utentes',
  },
  {
    path: 'residents/detail/:id',
    component: ResidentsDetailComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker, Role.Relative] },
    title: 'Aconchego - Detalhes do utente',
  },
  {
    path: 'residents/create',
    component: ResidentsCreateComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager] },
    title: 'Aconchego - Adicionar utente',
  },
  {
    path: 'residents/:id/edit',
    component: ResidentsEditComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager] },
    title: 'Aconchego - Editar utente',
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker, Role.Relative] },
    title: 'Aconchego - Dashboard',
  },

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager] },
    title: 'Aconchego - Utilizadores',
  },
  {
    path: 'users/detail/:id',
    component: UsersDetailComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker, Role.Relative] },
    title: 'Aconchego - Detalhes do utilizador',
  },
  {
    path: 'users/create',
    component: UsersCreateComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager] },
    title: 'Aconchego - Adicionar utilizador',
  },
  {
    path: 'users/:id/edit',
    component: UsersEditComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker, Role.Relative] },
    title: 'Aconchego - Editar utilizador',
  },
  {
    path: 'residents/:residentId/medicaments',
    component: MedicationComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker, Role.Relative] },
    title: 'Aconchego - Medicamentos',
  },
  {
    path: 'residents/:residentId/medicaments/create',
    component: MedicationCreateComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker] },
    title: 'Aconchego - Adicionar medicamento',
  },
  {
    path: 'residents/:residentId/medicaments/:id/edit',
    component: MedicationEditComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker] },
    title: 'Aconchego - Editar medicamento',
  },
  {
    path: 'residents/:residentId/medicaments/:id',
    component: MedicationDetailsComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker, Role.Relative] },
    children: [
      {
        path: 'administration',
        component: MedicationAdministrationComponent,
        title: 'Aconchego - Administração de medicamentos',
      },
    ],
  },
  {
    path: 'residents/:residentId/medicaments/:id/administration',
    component: MedicationAdministrationComponent,
    canActivate: [authGuard],
    data: { roles: [Role.Manager, Role.Caretaker, Role.Relative] },
    title: 'Aconchego - Administração de medicamentos',
  },

  {
    path: 'forbidden',
    component: NotAllowedComponent,
    title: 'Aconchego - Sem permissões',
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
    title: 'Aconchego - Página não encontrada',
  },
];
