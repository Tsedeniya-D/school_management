import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { ViewGradesComponent } from './components/view-grades/view-grades.component';

const routes: Routes = [
  {
    path: '',
    component: StudentDashboardComponent,
    children: [
      { path: '', redirectTo: 'grades', pathMatch: 'full' },
      { path: 'grades', component: ViewGradesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
