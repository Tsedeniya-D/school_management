import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  userForm!: FormGroup;
  subjects: any[] = [];
  grades: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: [this.data.user?.name || '', Validators.required],
      email: [this.data.user?.email || '', [Validators.required, Validators.email]],
      password: [this.data.mode === 'create' ? '' : '******', this.data.mode === 'create' ? [Validators.required, Validators.minLength(6)] : []],
      subjects: [this.data.user?.subjects?.map((s: any) => s._id || s) || []],
      grade: [this.data.user?.grade?._id || this.data.user?.grade || null]
    });

    this.loadSubjects();
    if (this.data.role === 'Student') {
      this.loadGrades();
    }
  }

  loadSubjects(): void {
    this.adminService.getSubjects().subscribe({
      next: (response) => {
        if (response.success) {
          this.subjects = response.subjects;
        }
      }
    });
  }

  loadGrades(): void {
    this.adminService.getGrades().subscribe({
      next: (response) => {
        if (response.success) {
          this.grades = response.grades;
        }
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      const formValue = { ...this.userForm.value };
      
      if (formValue.password === '******') {
        delete formValue.password;
      }

      if (this.data.mode === 'create') {
        formValue.role = this.data.role;
        this.adminService.createUser(formValue).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open(`${this.data.role} created successfully`, 'Close', {
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
        this.adminService.updateUser(this.data.user._id, formValue).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open(`${this.data.role} updated successfully`, 'Close', {
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
