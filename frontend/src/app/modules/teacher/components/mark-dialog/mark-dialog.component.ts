import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeacherService } from '../../../../services/teacher.service';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-mark-dialog',
  templateUrl: './mark-dialog.component.html',
  styleUrls: ['./mark-dialog.component.scss']
})
export class MarkDialogComponent implements OnInit {
  markForm!: FormGroup;
  students: any[] = [];
  subjects: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private adminService: AdminService,
    private dialogRef: MatDialogRef<MarkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.markForm = this.fb.group({
      student: [this.data.mark?.student?._id || this.data.student?._id || '', Validators.required],
      subject: [this.data.mark?.subject?._id || '', Validators.required],
      marks: [this.data.mark?.marks || '', [Validators.required, Validators.min(0), Validators.max(100)]],
      examType: [this.data.mark?.examType || 'Quiz', Validators.required],
      remarks: [this.data.mark?.remarks || '']
    });

    this.loadStudents();
    this.loadSubjects();
  }

  loadStudents(): void {
    this.teacherService.getStudents().subscribe({
      next: (response) => {
        if (response.success) {
          this.students = response.students || [];
        }
      }
    });
  }

  loadSubjects(): void {
    if (this.data.subjects) {
      this.subjects = this.data.subjects;
    } else {
      this.adminService.getSubjects().subscribe({
        next: (response) => {
          if (response.success) {
            this.subjects = response.subjects;
          }
        }
      });
    }
  }

  onSubmit(): void {
    if (this.markForm.valid) {
      this.isLoading = true;
      const formValue = this.markForm.value;
      formValue.marks = parseFloat(formValue.marks);

      if (this.data.mode === 'create') {
        this.teacherService.createMark(formValue).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Marks assigned successfully', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.dialogRef.close(true);
            }
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      } else {
        this.teacherService.updateMark(this.data.mark._id, formValue).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Marks updated successfully', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.dialogRef.close(true);
            }
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
