import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {NgClass} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.css',
})
export class FormLoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

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

  ngOnInit(): void {
    this.loginForm.reset();
    this.loginForm.markAsUntouched();

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
      error: (error) => {
        this.loginForm.setErrors({ invalid: true });
      },
    });
  }
}
