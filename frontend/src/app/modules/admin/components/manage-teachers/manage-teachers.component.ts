import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../../services/admin.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-manage-teachers',
  templateUrl: './manage-teachers.component.html',
  styleUrls: ['./manage-teachers.component.scss']
})
export class ManageTeachersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'subjects', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTeachers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.adminService.getUsers('Teacher').subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource.data = response.users;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openDialog(teacher?: any): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user: teacher, role: 'Teacher', mode: teacher ? 'edit' : 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTeachers();
      }
    });
  }

  deleteTeacher(id: string): void {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.adminService.deleteUser(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Teacher deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadTeachers();
          }
        }
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
