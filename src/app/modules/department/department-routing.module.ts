import { Routes } from '@angular/router';
import { DepartmentViewComponent } from './department-view/department-view.component';
import { AddDepartmentComponent } from './department-view/add-department/add-department.component';

export const DepartmentRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: DepartmentViewComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "add-department",
        component: AddDepartmentComponent
      }
    ]
  },

];