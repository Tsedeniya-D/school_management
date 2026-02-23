import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../../services/admin.service';
import { GradeDialogComponent } from '../grade-dialog/grade-dialog.component';
import { AssignDialogComponent } from '../assign-dialog/assign-dialog.component';

@Component({
  selector: 'app-manage-grades',
  templateUrl: './manage-grades.component.html',
  styleUrls: ['./manage-grades.component.scss']
})
export class ManageGradesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'teachers', 'students', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadGrades();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadGrades(): void {
    this.isLoading = true;
    this.adminService.getGrades().subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource.data = response.grades;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openDialog(grade?: any): void {
    const dialogRef = this.dialog.open(GradeDialogComponent, {
      width: '500px',
      data: { grade, mode: grade ? 'edit' : 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGrades();
      }
    });
  }

  openAssignDialog(grade: any): void {
    const dialogRef = this.dialog.open(AssignDialogComponent, {
      width: '600px',
      data: { grade }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGrades();
      }
    });
  }

  deleteGrade(id: string): void {
    if (confirm('Are you sure you want to delete this grade?')) {
      this.adminService.deleteGrade(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Grade deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadGrades();
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
