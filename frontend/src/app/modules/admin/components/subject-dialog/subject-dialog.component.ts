import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-subject-dialog',
  templateUrl: './subject-dialog.component.html',
  styleUrls: ['./subject-dialog.component.scss']
})
export class SubjectDialogComponent implements OnInit {
  subjectForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private dialogRef: MatDialogRef<SubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.subjectForm = this.fb.group({
      name: [this.data.subject?.name || '', Validators.required],
      description: [this.data.subject?.description || '']
    });
  }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      this.isLoading = true;
      if (this.data.mode === 'create') {
        this.adminService.createSubject(this.subjectForm.value).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Subject created successfully', 'Close', {
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
        this.adminService.updateSubject(this.data.subject._id, this.subjectForm.value).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Subject updated successfully', 'Close', {
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
