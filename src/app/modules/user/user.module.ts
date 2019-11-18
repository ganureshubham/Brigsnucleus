import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserViewComponent } from './user-view/user-view.component';
import { AddUserComponent } from './user-view/add-user/add-user.component';
import { RouterModule } from '@angular/router';
import { UserRoutes } from './user-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { DepartmentFilterComponent } from './department-filter/department-filter.component';

@NgModule({
  declarations: [UserViewComponent, AddUserComponent, DepartmentFilterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(UserRoutes),
    MaterialModule,
    FormsModule,
    NgxSpinnerModule
    
  ]
})
export class UserModule { }
