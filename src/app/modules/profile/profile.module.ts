import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { RouterModule } from '@angular/router';
import { ProfileRoutes } from './profile-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileRoutes),
    MaterialModule,
    FormsModule
  ]
})
export class ProfileModule { } 
