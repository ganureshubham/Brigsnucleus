import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SuperadminChangePasswordComponent } from './superadmin-change-password/superadmin-change-password.component';

export const ProfileRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ViewProfileComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "admin-change-password",
        component: ChangePasswordComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "superadmin-change-password",
        component: SuperadminChangePasswordComponent
      }
    ]
  },


];
