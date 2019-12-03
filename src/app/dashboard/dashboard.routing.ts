import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SuperadminDashboardComponent } from './superadmin-dashboard/superadmin-dashboard.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full'
      },
      {
        path: 'superadmin',
        component: SuperadminDashboardComponent,
      },
      {
        path: 'admin',
        component: DashboardComponent,
      }
    ]
  }
];