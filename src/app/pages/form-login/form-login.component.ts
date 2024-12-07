import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InputComponent } from '../../components/forms/input/input.component';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, InputComponent],
  templateUrl: './form-login.component.html',
})
export class FormLoginComponent implements OnInit {
  errorMessage = '';

  email = new FormControl('', {
    validators: Validators.compose([Validators.required, Validators.email]),
    updateOn: 'change',
  });
  password = new FormControl('', {
    validators: Validators.compose([
      Validators.required,
      Validators.minLength(6),
    ]),
    updateOn: 'change',
  });
  loginForm: FormGroup = new FormGroup({
    email: this.email,
    password: this.password,
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm.reset();
    this.loginForm.markAsUntouched();
    this.errorMessage = '';

    this.authService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.router.navigateByUrl('/dashboard');
        }
      },
    });
  }

  login() {
    if (this.loginForm.invalid || this.loginForm.untouched) return;

    this.authService.login(this.email.value!, this.password.value!).subscribe({
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.errorMessage = 'Email ou password errados';
        }
      },
    });
  }
}
