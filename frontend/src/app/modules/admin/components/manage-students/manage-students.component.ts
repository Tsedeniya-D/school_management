import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../../services/admin.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-manage-students',
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss']
})
export class ManageStudentsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'grade', 'subjects', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadStudents(): void {
    this.isLoading = true;
    this.adminService.getUsers('Student').subscribe({
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

  openDialog(student?: any): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user: student, role: 'Student', mode: student ? 'edit' : 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudents();
      }
    });
  }

  deleteStudent(id: string): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.adminService.deleteUser(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Student deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadStudents();
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
