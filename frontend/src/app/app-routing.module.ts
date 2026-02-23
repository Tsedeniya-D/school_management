
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'teacher',
    loadChildren: () => import('./modules/teacher/teacher.module').then(m => m.TeacherModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Teacher'] }
  },
  {
    path: 'student',
    loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] }
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
