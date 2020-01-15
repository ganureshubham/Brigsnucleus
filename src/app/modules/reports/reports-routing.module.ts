import { Routes } from '@angular/router';
import { ReportsHomeComponent } from './components/reports-home/reports-home.component';
import { PendingComplaintsComponent } from './components/reports-details/pending-complaints/pending-complaints.component';
import { PendingTasksComponent } from './components/reports-details/pending-tasks/pending-tasks.component';
import { CriticalConditionAssetsComponent } from './components/reports-details/critical-condition-assets/critical-condition-assets.component';
import { PendingMaintainanceAssetsComponent } from './components/reports-details/pending-maintainance-assets/pending-maintainance-assets.component';
import { AssetsComponent } from './components/reports-details/assets/assets.component';
import { OrganizationLevelAssetsComponent } from './components/reports-details/organization-level-assets/organization-level-assets.component';

export const ReportsRoutingModule: Routes = [
  {
    path: "",
    component: ReportsHomeComponent,
    children: [
      {
        path: "",
        redirectTo: "pending-complaints",
        pathMatch: "full"
      },
      {
        path: "pending-complaints",
        component: PendingComplaintsComponent
      },
      {
        path: "pending-tasks",
        component: PendingTasksComponent
      },
      {
        path: "pending-maintainance-assets",
        component: PendingMaintainanceAssetsComponent
      },
      {
        path: "critical-assets",
        component: CriticalConditionAssetsComponent
      },
      {
        path: "category-wise-assets",
        component: AssetsComponent
      },
      {
        path: "all-assets",
        component: OrganizationLevelAssetsComponent
      }
    ]
  }
]
