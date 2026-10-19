import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
// import { LoginValues } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthStore } from '../../../../core/services/auth-store.service';
import { Button } from '../../../../shared/components/button/button';
import { Input } from '../../../../shared/components/input/input';
import { MatCardModule } from '@angular/material/card';
import { LoginValues } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
  imports: [Input, Button, ReactiveFormsModule, MatCardModule, RouterLink],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload: LoginValues = {
      email: this.f.email.value!,
      password: this.f.password.value!,
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (typeof response?.access_token !== 'string' || !response.user) {
          this.errorMessage = 'Login response was incomplete. Please try again.';
          return;
        }

        this.authStore.setSession(response.access_token, response.user);
        this.successMessage = 'You are now logged in.';
        console.log('Login successful:', response);
      },
      error: (error: { error?: { message?: string } }) => {
        this.isSubmitting = false;
        this.errorMessage =
          error.error?.message || 'Unable to log in. Please check your details and try again.';
      },
    });
  }
}
