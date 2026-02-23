import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.redirectByRole(user.role);
      }
    }
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['Student', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      const { name, email, password, role } = this.signupForm.value;

      this.authService.register({ name, email, password, role }).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.snackBar.open('Registration successful!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.redirectByRole(response.user.role);
          }
        },
        error: () => {
          this.isLoading = false;
          // Error is handled by interceptor
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'Admin':
        this.router.navigate(['/admin']);
        break;
      case 'Teacher':
        this.router.navigate(['/teacher']);
        break;
      case 'Student':
        this.router.navigate(['/student']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.signupForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('minlength')) {
      if (fieldName === 'name') {
        return 'Name must be at least 3 characters';
      }
      return 'Password must be at least 6 characters';
    }
    return '';
  }

  getPasswordMismatchError(): string {
    if (this.signupForm.hasError('passwordMismatch') && 
        this.signupForm.get('confirmPassword')?.touched) {
      return 'Passwords do not match';
    }
    return '';
  }
}
