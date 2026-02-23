import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../../services/admin.service';
import { SubjectDialogComponent } from '../subject-dialog/subject-dialog.component';

@Component({
  selector: 'app-manage-subjects',
  templateUrl: './manage-subjects.component.html',
  styleUrls: ['./manage-subjects.component.scss']
})
export class ManageSubjectsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadSubjects();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadSubjects(): void {
    this.isLoading = true;
    this.adminService.getSubjects().subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource.data = response.subjects;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openDialog(subject?: any): void {
    const dialogRef = this.dialog.open(SubjectDialogComponent, {
      width: '500px',
      data: { subject, mode: subject ? 'edit' : 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSubjects();
      }
    });
  }

  deleteSubject(id: string): void {
    if (confirm('Are you sure you want to delete this subject?')) {
      this.adminService.deleteSubject(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Subject deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadSubjects();
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
