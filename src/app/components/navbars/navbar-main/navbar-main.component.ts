import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {map, Observable} from 'rxjs';
import {AuthService} from '../../../services/auth/auth.service';
import {User} from '../../../interfaces/user';
import { AsyncPipe, NgComponentOutlet, NgIf, NgOptimizedImage } from '@angular/common';
import {NavbarPublicComponent} from '../navbar-public/navbar-public.component';
import {Role} from '../../../interfaces/roles.enum';
import {NavbarManagerComponent} from '../navbar-manager/navbar-manager.component';
import {NavbarCaretakerComponent} from '../navbar-caretaker/navbar-caretaker.component';
import {NavbarRelativeComponent} from '../navbar-relative/navbar-relative.component';

@Component({
  selector: 'app-navbar-main',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    NgIf,
    NgComponentOutlet,
    NgOptimizedImage,
  ],
  templateUrl: './navbar-main.component.html',
  styleUrl: './navbar-main.component.css'
})
export class NavbarMainComponent {
  constructor(private router: Router, private authService: AuthService) {
  }

  get loggedIn(): Observable<boolean> {
    return this.authService.getUser().pipe(
      map((user: User | null) => !!user),
    )
  }


  get navbarLinks() {
    return this.authService.getUser().pipe(map((user: User | null) => {
      switch (user?.role) {
        // case Role.Admin:
        //   return NavbarAdminComponent;
        case Role.Manager:
          return NavbarManagerComponent;
        case Role.Caretaker:
          return NavbarCaretakerComponent;
        case Role.Relative:
          return NavbarRelativeComponent;
        default:
          return NavbarPublicComponent;
      }
    }));

  }



  logout() {
    this.authService.logout();
  }
}
