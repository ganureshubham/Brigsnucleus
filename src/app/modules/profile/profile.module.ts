import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { RouterModule } from '@angular/router';
import { ProfileRoutes } from './profile-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SuperadminChangePasswordComponent } from './superadmin-change-password/superadmin-change-password.component';

@NgModule({
  declarations: [ViewProfileComponent, ChangePasswordComponent, SuperadminChangePasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileRoutes),
    MaterialModule,
    FormsModule,
    FlexLayoutModule
  ]
})
export class ProfileModule { } 
