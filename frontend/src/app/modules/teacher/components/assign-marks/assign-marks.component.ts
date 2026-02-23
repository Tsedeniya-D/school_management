import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TeacherService } from '../../../../services/teacher.service';
import { MarkDialogComponent } from '../mark-dialog/mark-dialog.component';

@Component({
  selector: 'app-assign-marks',
  templateUrl: './assign-marks.component.html',
  styleUrls: ['./assign-marks.component.scss']
})
export class AssignMarksComponent implements OnInit {
  displayedColumns: string[] = ['student', 'subject', 'marks', 'examType', 'remarks', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private teacherService: TeacherService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadMarks();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadMarks(): void {
    this.isLoading = true;
    this.teacherService.getMarks().subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource.data = response.marks || [];
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openDialog(mark?: any): void {
    const dialogRef = this.dialog.open(MarkDialogComponent, {
      width: '500px',
      data: { mark, mode: mark ? 'edit' : 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMarks();
      }
    });
  }

  deleteMark(id: string): void {
    if (confirm('Are you sure you want to delete this mark?')) {
      this.teacherService.deleteMark(id).subscribe({
        next: () => {
          this.loadMarks();
        }
      });
    }
  }
}
