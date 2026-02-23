import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
            errorMessage = 'Session expired. Please login again.';
          } else if (error.status === 403) {
            errorMessage = error.error?.message || 'You do not have permission to access this resource.';
          } else if (error.status === 404) {
            errorMessage = error.error?.message || 'Resource not found.';
          } else if (error.status === 400) {
            errorMessage = error.error?.message || 'Invalid request.';
          } else if (error.status >= 500) {
            errorMessage = error.error?.message || 'Server error. Please try again later.';
          } else {
            errorMessage = error.error?.message || error.message;
          }
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });

        return throwError(() => error);
      })
    );
  }
}
