import { Routes } from '@angular/router';
import { ViewComplaintsComponent } from './components/view-complaints/view-complaints.component';
import { AddComplaintsComponent } from './components/add-complaints/add-complaints.component';
import { DetailsComplaintsComponent } from './components/details-complaints/details-complaints.component';

export const ComplaintRoutes: Routes = [
  {
    path: '',
    component: ViewComplaintsComponent,
    children: [
      {
        path: 'add-complaint',
        component: AddComplaintsComponent
      }
    ]
  },

  // {
  //   path : 'details-complaints',
  //   component : DetailsComplaintsComponent, 
  //   children : [
  //     {
  //       path : ''
  //     }
  //   ]
  // }


]