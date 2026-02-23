import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing.module';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { ViewGradesComponent } from './components/view-grades/view-grades.component';

@NgModule({
  declarations: [
    StudentDashboardComponent,
    ViewGradesComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ]
})
export class StudentModule { }
