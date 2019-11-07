import { Routes } from '@angular/router';
import { ChecklistViewComponent } from './checklist-view/checklist-view.component';
import { AddChecklistComponent } from './checklist-view/add-checklist/add-checklist.component';

export const ChecklistRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component:ChecklistViewComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "add-checklist",
        component: AddChecklistComponent  
      }
    ]
  },

];
