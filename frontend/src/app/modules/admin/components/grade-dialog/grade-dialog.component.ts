import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-grade-dialog',
  templateUrl: './grade-dialog.component.html',
  styleUrls: ['./grade-dialog.component.scss']
})
export class GradeDialogComponent implements OnInit {
  gradeForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private dialogRef: MatDialogRef<GradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.gradeForm = this.fb.group({
      name: [this.data.grade?.name || '', Validators.required],
      description: [this.data.grade?.description || '']
    });
  }

  onSubmit(): void {
    if (this.gradeForm.valid) {
      this.isLoading = true;
      if (this.data.mode === 'create') {
        this.adminService.createGrade(this.gradeForm.value).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Grade created successfully', 'Close', {
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
        this.adminService.updateGrade(this.data.grade._id, this.gradeForm.value).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Grade updated successfully', 'Close', {
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
