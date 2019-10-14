import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManufacturerViewComponent } from './manufacturer-view/manufacturer-view.component';
import { AddManufacturerComponent } from './manufacturer-view/add-manufacturer/add-manufacturer.component';

export const ManufacturerRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component:ManufacturerViewComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "add-manufacturer",
        component: AddManufacturerComponent  
      }
    ]
  },

];