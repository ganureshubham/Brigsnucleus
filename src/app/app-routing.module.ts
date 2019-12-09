import { Routes } from '@angular/router';
import { AdminComponent } from './layouts/admin/admin.component';
import { AuthGuard } from './guards/auth.guard'
import { LoginComponent } from './login/login.component';
import { PagenotfoundComponent } from './shared/pagenotfound/pagenotfound.component';

export const AppRoutes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        loadChildren: "./dashboard/dashboard.module#DashboardModule",
        canActivate: [AuthGuard]
      },
      {
        path: "superadmin/organization",
        loadChildren: "./modules/organization/organization.module#OrganizationModule",
        canActivate: [AuthGuard]
      },
      {
        path: "superadmin/sys-admins",
        loadChildren: "./modules/system-admins/system-admins.module#SystemAdminsModule",
        canActivate: [AuthGuard]
      },
      {
        path: "location-type",
        loadChildren: "./modules/location-type/location-type.module#LocationTypeModule",
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
        path: "department",
        loadChildren: "./modules/department/department.module#DepartmentModule",
        canActivate: [AuthGuard]
      },
      {
        path: "alert",
        loadChildren: "./modules/alert/alert.module#AlertModule",
        canActivate: [AuthGuard]
      },
      {
        path: "assetmate",
        loadChildren: "./modules/assetmate/assetmate.module#AssetmateModule",
        canActivate: [AuthGuard]
      },
      {
        path: "profile",
        loadChildren: "./modules/profile/profile.module#ProfileModule",
        canActivate: [AuthGuard]
      },
      {
        path: "documate",
        loadChildren: "./modules/documate/documate.module#DocumateModule",
        canActivate: [AuthGuard]
      },
      {
        path: "asset-category",
        loadChildren: "./modules/asset-category/asset-category.module#AssetCategoryModule",
        canActivate: [AuthGuard]
      },
      {
        path: "complaints",
        loadChildren: "./modules/complaints/complaints.module#ComplaintsModule",
        canActivate: [AuthGuard]
      },
      {
        path: "taskmate",
        loadChildren: "./modules/taskmate/taskmate.module#TaskmateModule",
        canActivate: [AuthGuard]
      },

    ]
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: '404',
    component: PagenotfoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];


