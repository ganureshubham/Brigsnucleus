import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserViewComponent } from './user-view/user-view.component';
import { AddUserComponent } from './user-view/add-user/add-user.component';

export const UserRoutes: Routes = [
  {
    path: "user-list",
    component: UserViewComponent
  },
  {
    path: "add-user",
    component: AddUserComponent
  }

]; 