import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// import { LoginValues } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthStore } from '../../../../core/services/auth-store.service';
import { Button } from '../../../../shared/components/button/button';
import { Input } from '../../../../shared/components/input/input';
import { MatCardModule } from '@angular/material/card';
import { LoginRequest } from '../../../../core/models/auth.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
  imports: [Input, Button, ReactiveFormsModule, MatCardModule, RouterLink, MatCheckboxModule],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  private readonly authStore = inject(AuthStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  rememberMe!: boolean;

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false], // بتبدأ بـ false افتراضياً
  });

  isSubmitting = false;

  get f() {
    return this.loginForm.controls;
  }

  showErrorMessage() {
    this.snackBar.open('Invalid email or password PLZ try again', 'close', {
      duration: 5000, // يختفي بعد 5 ثواني
      horizontalPosition: 'center', // المكان أفقياً (center / start / end)
      verticalPosition: 'top', // المكان رأسياً (top / bottom)
      panelClass: ['error-snackbar'], // كلاس SCSS لتنسيق اللون الأحمر
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload: LoginRequest = {
      email: this.f.email.value!,
      password: this.f.password.value!,
    };
    this.rememberMe = this.f.rememberMe.value ?? false;
    this.authService.login(payload, this.rememberMe).subscribe({
      next: (res) => {
        const token = res.access_token;
        const user = res.user.user_metadata;
        if (token && user) {
          this.router.navigate(['/project']);
        } else {
          this.showErrorMessage();
        }
        //}
        console.log('Login successful:', res);
      },
      error: (err) => {
        console.log('Login error:', err);
        if (err) {
          this.showErrorMessage();
        }
      },
    });
  }
}
