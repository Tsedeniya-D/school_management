import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../services/teacher.service';
import { MatDialog } from '@angular/material/dialog';
import { MarkDialogComponent } from '../mark-dialog/mark-dialog.component';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  students: any[] = [];
  subjects: any[] = [];
  isLoading = false;

  constructor(
    private teacherService: TeacherService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.teacherService.getStudents().subscribe({
      next: (response) => {
        if (response.success) {
          this.students = response.students || [];
          this.subjects = response.subjects || [];
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openMarkDialog(student: any): void {
    const dialogRef = this.dialog.open(MarkDialogComponent, {
      width: '500px',
      data: { student, subjects: this.subjects }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  viewStudentDetails(student: any): void {
    this.teacherService.getStudent(student._id).subscribe({
      next: (response) => {
        if (response.success) {
          // Show student details in a dialog or navigate
          console.log('Student details:', response);
        }
      }
    });
  }
}
