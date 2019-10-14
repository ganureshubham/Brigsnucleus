import { Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth/auth.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { AuthGuard } from './public service/auth-guard.service';


export const AppRoutes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: "./dashboard/dashboard.module#DashboardModule",
        canActivate: [AuthGuard]
      },
      {
        path: "asset",
        loadChildren: "./modules/asset/asset.module#AssetModule",
        canActivate: [AuthGuard]
      },
      {
        path: "asset-category",
        loadChildren: "./modules/asset-category/asset-category.module#AssetCategoryModule",
        canActivate: [AuthGuard]
      },
      {
        path: "user-role",
        loadChildren: "./modules/role/role.module#RoleModule",
        canActivate: [AuthGuard]
      },
      {
        path: "supplier",
        loadChildren: "./modules/supplier/supplier.module#SupplierModule",
        canActivate: [AuthGuard]
      },
      {
        path: "manufacturer",
        loadChildren: "./modules/manufacturer/manufacturer.module#ManufacturerModule",
        canActivate: [AuthGuard]
      },
      {
        path: "user",
        loadChildren: "./modules/user/user.module#UserModule",
        canActivate: [AuthGuard]
      },
      {
        path :"department",
        loadChildren : "./modules/department/department.module#DepartmentModule",
        canActivate: [AuthGuard] 

      },
      {
        path :"alert",
        loadChildren : "./modules/alert/alert.module#AlertModule",
        canActivate: [AuthGuard]

      },
      // {
      //   path :"",
      //   loadChildren : "",

      // },
      // {
      //   path :"",
      //   loadChildren : "",

      // }
    ]
  },
  {
    path: "",
    component: AuthComponent,
    children: [
      {
        path: "",
        loadChildren: "./login/login.module#LoginModule"
      }
    ]
  }
];


