import { Component, computed, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SignupRequest } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthStore } from '../../../../core/services/auth-store.service';
import { Router } from '@angular/router';
import { Input } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';
import { MatCardModule } from '@angular/material/card';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { RouterLink } from '@angular/router';
// import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  standalone: true,
  imports: [Input, Button, ReactiveFormsModule, MatCardModule, MatIconModule, MatSnackBarModule],
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  private snackBar = inject(MatSnackBar);

  // errorMessage = signal<string | null>(null);

  // Custom Validator لمطابقة Passwords
  private confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword?.value) return null;

    // return password === confirmPassword ? null :
    // confirmControl.setErrors({ passwordMismatch: true }); // 👈 السطر ده بس اللي زاد!
    //  { passwordMismatch: true };

    if (password !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true }); // 👈 السطر ده بس اللي زاد!
      return { passwordMismatch: true };
    }

    return null;
  }

  signupForm = this.fb.group(
    {
      // Name: حروف عربي/إنجليزي ومع مع مع مع منع الرموز والأرقام والمسافات المتتالية
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[\p{L}]+(?: [\p{L}]+)*$/u),
        ],
      ],

      // Email
      email: ['', [Validators.required, Validators.email]],

      // Password: من 8 لـ 64، بدون مسافات، وتحتوي على uppercase, lowercase, digit, special char
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
          Validators.pattern(/^\S*$/),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
          ),
        ],
      ],

      // Confirm Password
      confirmPassword: ['', [Validators.required]],

      // Job Title: Optional
      jobTitle: [''],
    },
    {
      validators: this.confirmPasswordValidator, // Validator على مستوى الـ Form
    },
  );

  // 1. تحويل قيمة الـ password control إلى Signal لتتبعها لحظياً
  passwordValue = toSignal(this.signupForm.get('password')!.valueChanges, { initialValue: '' });

  // 2. Computed Signal لفحص شروط كلمة السر المعروضة في الـ UI
  passwordRules = computed(() => {
    const val = this.passwordValue() || '';
    return {
      hasMinLength: val.length >= 8,
      hasUpperLowerDigit: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val),
    };
  });

  get f() {
    return this.signupForm.controls;
  }

  showEmailExistsAlert() {
    this.snackBar.open(
      'هذا البريد الإلكتروني مُسجل بالفعل، يرجى تسجيل الدخول أو استخدام إيميل آخر.',
      'إغلاق',
      {
        duration: 5000, // يختفي بعد 5 ثواني
        horizontalPosition: 'center', // المكان أفقياً (center / start / end)
        verticalPosition: 'top', // المكان رأسياً (top / bottom)
        panelClass: ['error-snackbar'], // كلاس SCSS لتنسيق اللون الأحمر
      },
    );
  }

  onSubmit() {
    console.log('11111');
    if (this.signupForm.invalid) {
      console.log('222');
      this.signupForm.markAllAsTouched();
      return;
    } else {
      console.log('333');

      const formValue = this.signupForm.value;

      const payload: SignupRequest = {
        email: formValue.email!,
        password: formValue.password!,
        data: {
          name: formValue.name!,
          ...(formValue.jobTitle?.trim() && { job_title: formValue.jobTitle.trim() }),
        },
      };
      this.authService.signup(payload).subscribe({
        next: (res) => {
          console.log('ggggggg');
          const token = res.access_token;
          const user = res.user.user_metadata;
          console.log('Success:', res);
          console.log('tt:', token);
          console.log('uu:', user);

          if (token && user) {
            // this.authStore.setSession(token, user);
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.log('err4444');

          // console.error('Error:', err.error.error_code);
          // const saveErrorMessage = err. error.error_code ;
          // this.errorMessage.set( saveErrorMessage)
          if (err) {
            this.showEmailExistsAlert();
          }
        },
      });
    }
  }
}
