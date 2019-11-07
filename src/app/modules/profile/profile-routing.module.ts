import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewProfileComponent } from './view-profile/view-profile.component';

export const ProfileRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component:ViewProfileComponent
      }
    ]
  },


];
