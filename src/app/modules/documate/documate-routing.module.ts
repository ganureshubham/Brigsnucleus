import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumateViewComponent } from './documate-view/documate-view.component';
import { AddDocumateComponent } from './documate-view/add-documate/add-documate.component';

export const DocumateRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: DocumateViewComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "add-documate",
        component: AddDocumateComponent
      }
    ]
  },

];