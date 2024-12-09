import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
export class FormLoginComponent implements OnInit, OnDestroy {
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

  constructor(private authService: AuthService, private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      this.renderer.removeClass(mainElement, 'container');
      this.renderer.removeClass(mainElement, 'px-2');
      this.renderer.removeClass(mainElement, 'sm:px-0');
      this.renderer.removeClass(mainElement, 'mx-auto');
      this.renderer.removeClass(mainElement, 'pt-10');

    }

    this.loginForm.reset();
    this.loginForm.markAsUntouched();
    this.errorMessage = '';

    this.authService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.router.navigateByUrl('/dashboard').then(r => console.log(r));
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

  ngOnDestroy() {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      this.renderer.addClass(mainElement, 'container');
      this.renderer.addClass(mainElement, 'px-2');
      this.renderer.addClass(mainElement, 'sm:px-0');
      this.renderer.addClass(mainElement, 'mx-auto');
      this.renderer.addClass(mainElement, 'pt-10');
    }
  }
}
