import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierViewComponent } from './supplier-view/supplier-view.component';
import { AddSupplierComponent } from './supplier-view/add-supplier/add-supplier.component';

export const SupplierRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component:SupplierViewComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "add-supplier",
        component: AddSupplierComponent  
      }
    ]
  },

];