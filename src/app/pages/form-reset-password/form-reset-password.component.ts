import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { InputComponent } from '../../components/forms/input/input.component';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, InputComponent, NgIf],
  templateUrl: './form-reset-password.component.html',
})
export class FormResetPasswordComponent implements OnInit, OnDestroy {
  errorMessage = '';
  userId!: number;


  newPassword = new FormControl('', {
    validators: Validators.compose([Validators.required, Validators.minLength(6)]),
    updateOn: 'change',
  });
  confirmPassword = new FormControl('', {
    validators: Validators.compose([Validators.required, Validators.minLength(6)]),
    updateOn: 'change',
  });

  resetPasswordForm: FormGroup = new FormGroup({
    newPassword: this.newPassword,
    confirmPassword: this.confirmPassword,
  });

  constructor(private authService: AuthService, private router: Router, private renderer: Renderer2, private route: ActivatedRoute, private toastService: ToastService) {}


  ngOnInit(): void {
    // Get userId from route parameter
    this.route.params.subscribe((params) => {
      this.userId = +params['id']; // Ensure it's converted to a number
    });

    const mainElement = document.querySelector('main');
    if (mainElement) {
      this.renderer.removeClass(mainElement, 'container');
      this.renderer.removeClass(mainElement, 'px-2');
      this.renderer.removeClass(mainElement, 'sm:px-0');
      this.renderer.removeClass(mainElement, 'mx-auto');
      this.renderer.removeClass(mainElement, 'pt-10');
    }

    this.resetPasswordForm.reset();
    this.resetPasswordForm.markAsUntouched();
    this.errorMessage = '';
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid || this.resetPasswordForm.untouched) return;

    const newPassword = this.newPassword.value!;
    const confirmPassword = this.confirmPassword.value!;

    this.authService.resetPassword(this.userId, newPassword).subscribe({
      next: () => {
        this.toastService.success('Palavra-passe atualizada com sucesso.');
        this.router.navigateByUrl('/dashboard').then(() => {
          console.log('Redirected to login after password reset');
        });
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error('Erro ao atualizar a palavra-passe.');
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
