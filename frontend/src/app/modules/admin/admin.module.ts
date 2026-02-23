import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManageTeachersComponent } from './components/manage-teachers/manage-teachers.component';
import { ManageStudentsComponent } from './components/manage-students/manage-students.component';
import { ManageSubjectsComponent } from './components/manage-subjects/manage-subjects.component';
import { ManageGradesComponent } from './components/manage-grades/manage-grades.component';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { SubjectDialogComponent } from './components/subject-dialog/subject-dialog.component';
import { GradeDialogComponent } from './components/grade-dialog/grade-dialog.component';
import { AssignDialogComponent } from './components/assign-dialog/assign-dialog.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageTeachersComponent,
    ManageStudentsComponent,
    ManageSubjectsComponent,
    ManageGradesComponent,
    UserDialogComponent,
    SubjectDialogComponent,
    GradeDialogComponent,
    AssignDialogComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule,
    MatChipsModule,
    MatGridListModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule
  ]
})
export class AdminModule { }
