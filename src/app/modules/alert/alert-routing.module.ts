import { Routes } from '@angular/router';
import { AlertViewComponent } from './alert-view/alert-view.component';
import { AlertDetailsComponent } from './alert-view/alert-details/alert-details.component';


export const AlertRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: AlertViewComponent
      }
    ]
  },

  {
    path: "",
    children: [
      {
        path: "alert-details",
        component: AlertDetailsComponent
      }
    ]
  },
];