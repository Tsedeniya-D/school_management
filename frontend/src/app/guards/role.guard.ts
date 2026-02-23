import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.authService.getCurrentUser();
    const allowedRoles = route.data['roles'] as Array<string>;

    if (user && allowedRoles.includes(user.role)) {
      return true;
    }

    // Redirect based on user role
    if (user) {
      if (user.role === 'Admin') {
        this.router.navigate(['/admin']);
      } else if (user.role === 'Teacher') {
        this.router.navigate(['/teacher']);
      } else if (user.role === 'Student') {
        this.router.navigate(['/student']);
      }
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }
}
