import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentViewComponent } from './department-view/department-view.component';
import { AddDepartmentComponent } from './department-view/add-department/add-department.component';
import { RouterModule } from '@angular/router';
import { DepartmentRoutes } from './department-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DepartmentViewComponent, AddDepartmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DepartmentRoutes),
    MaterialModule,
    FormsModule

  ],

})
export class DepartmentModule { } 
