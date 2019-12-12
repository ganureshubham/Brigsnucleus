import { Routes } from '@angular/router';
import { ReportsHomeComponent } from './components/reports-home/reports-home.component';
import { PendingComplaintsComponent } from './components/reports-details/pending-complaints/pending-complaints.component';
import { PendingTasksComponent } from './components/reports-details/pending-tasks/pending-tasks.component';
import { ComplainingAssetsComponent } from './components/reports-details/complaining-assets/complaining-assets.component';

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
        path: "complaining-assets",
        component: ComplainingAssetsComponent
      }
    ]
  }
]
