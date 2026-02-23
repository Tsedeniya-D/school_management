import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-assign-dialog',
  templateUrl: './assign-dialog.component.html',
  styleUrls: ['./assign-dialog.component.scss']
})
export class AssignDialogComponent implements OnInit {
  assignForm!: FormGroup;
  teachers: any[] = [];
  students: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private dialogRef: MatDialogRef<AssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.assignForm = this.fb.group({
      teacherIds: [this.data.grade?.teachers?.map((t: any) => t._id || t) || []],
      studentIds: [this.data.grade?.students?.map((s: any) => s._id || s) || []]
    });

    this.loadTeachers();
    this.loadStudents();
  }

  loadTeachers(): void {
    this.adminService.getUsers('Teacher').subscribe({
      next: (response) => {
        if (response.success) {
          this.teachers = response.users;
        }
      }
    });
  }

  loadStudents(): void {
    this.adminService.getUsers('Student').subscribe({
      next: (response) => {
        if (response.success) {
          this.students = response.users;
        }
      }
    });
  }

  onSubmit(): void {
    if (this.assignForm.valid) {
      this.isLoading = true;
      this.adminService.assignToGrade(this.data.grade._id, this.assignForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Assignments updated successfully', 'Close', {
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

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
