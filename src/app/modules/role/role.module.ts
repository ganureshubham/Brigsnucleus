import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleViewComponent } from './role-view/role-view.component';
import { AddRoleComponent } from './role-view/add-role/add-role.component';
import { RouterModule } from '@angular/router';
import { UserRoleRoutes } from './role-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [RoleViewComponent, AddRoleComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(UserRoleRoutes),
    MaterialModule,
    FormsModule,
    NgxSpinnerModule,
    FlexLayoutModule


  ]
})
export class RoleModule { } 
