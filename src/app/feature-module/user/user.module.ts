import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { CertificationManagementComponent } from './certification-management/certification-management.component';
import { CustomPaginationModule } from '../../shared/custom-pagination/custom-pagination.module';
import { SharedModule } from '../../shared/shared-module';


@NgModule({
  declarations: [
    UserComponent,
    TeacherDashboardComponent,
    CertificationManagementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule,
    CustomPaginationModule,
    SharedModule
  ]
})
export class UserModule { }
