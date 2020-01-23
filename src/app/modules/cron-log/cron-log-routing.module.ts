import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCronLogsComponent } from './components/view-cron-logs/view-cron-logs.component';

const routes: Routes = [
  {
    path: '',
    component: ViewCronLogsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CronLogRoutingModule { } 
