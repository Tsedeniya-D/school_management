import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { AssignMarksComponent } from './components/assign-marks/assign-marks.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherDashboardComponent,
    children: [
      { path: '', redirectTo: 'students', pathMatch: 'full' },
      { path: 'students', component: StudentsListComponent },
      { path: 'marks', component: AssignMarksComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
