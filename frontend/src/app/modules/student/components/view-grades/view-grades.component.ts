import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../../services/student.service';

@Component({
  selector: 'app-view-grades',
  templateUrl: './view-grades.component.html',
  styleUrls: ['./view-grades.component.scss']
})
export class ViewGradesComponent implements OnInit {
  studentData: any = {};
  subjectMarks: any[] = [];
  allMarks: any[] = [];
  isLoading = false;

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {
    this.isLoading = true;
    this.studentService.getGrades().subscribe({
      next: (response) => {
        if (response.success) {
          this.studentData = response.student || {};
          this.subjectMarks = response.subjectMarks || [];
          this.allMarks = response.marks || [];
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
