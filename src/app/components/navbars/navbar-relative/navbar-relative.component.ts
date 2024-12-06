import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map, tap } from 'rxjs';
import { UserRxpDTO } from '../../../interfaces/user';

@Component({
  selector: 'app-navbar-relative',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './navbar-relative.component.html',
  styleUrl: './navbar-relative.component.css'
})
export class NavbarRelativeComponent {
  @Input({required: true}) side!: boolean;

}
