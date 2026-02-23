import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';
import { AdminService } from '../../../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {};
  isLoading = false;
  currentUser: any;
  showDashboard = true;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadStats();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      this.showDashboard = url === '/admin' || url === '/admin/dashboard' || url === '/admin/';
    });
  }

  loadStats(): void {
    this.isLoading = true;
    this.adminService.getStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.stats;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  navigateTo(route: string): void {
    this.router.navigate([`/admin/${route}`]);
    this.showDashboard = false;
  }
}
