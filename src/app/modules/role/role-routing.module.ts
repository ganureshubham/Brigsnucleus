import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleViewComponent } from './role-view/role-view.component';
import { AddRoleComponent } from './role-view/add-role/add-role.component';


export const UserRoleRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component:RoleViewComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "add-user-role",
        component: AddRoleComponent  
      }
    ]
  },

];