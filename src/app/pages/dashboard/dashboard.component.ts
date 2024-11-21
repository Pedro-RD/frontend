import {Component} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {map} from 'rxjs';
import {User} from '../../interfaces/user';
import {Role} from '../../interfaces/roles.enum';
import {DashboardAdminComponent} from '../../components/dashboards/dashboard-admin/dashboard-admin.component';
import {DashboardManagerComponent} from '../../components/dashboards/dashboard-manager/dashboard-manager.component';
import {
  DashboardCaretakerComponent
} from '../../components/dashboards/dashboard-caretaker/dashboard-caretaker.component';
import {DashboardRelativeComponent} from '../../components/dashboards/dashboard-relative/dashboard-relative.component';
import {AsyncPipe, NgComponentOutlet} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgComponentOutlet,
    AsyncPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private authService: AuthService) {
  }

  get dashboard() {
    return this.authService.getUser().pipe(
      map((user: User | null) => {
        switch (user?.role) {
          // case Role.Admin:
          //   return DashboardAdminComponent;
          case  Role.Manager:
            return DashboardManagerComponent;
          case Role.Caretaker:
            return DashboardCaretakerComponent;
          default:
            return DashboardRelativeComponent;
        }
      })
    )
  }

}
