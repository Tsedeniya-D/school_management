import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManageTeachersComponent } from './components/manage-teachers/manage-teachers.component';
import { ManageStudentsComponent } from './components/manage-students/manage-students.component';
import { ManageSubjectsComponent } from './components/manage-subjects/manage-subjects.component';
import { ManageGradesComponent } from './components/manage-grades/manage-grades.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'teachers', component: ManageTeachersComponent },
      { path: 'students', component: ManageStudentsComponent },
      { path: 'subjects', component: ManageSubjectsComponent },
      { path: 'grades', component: ManageGradesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
