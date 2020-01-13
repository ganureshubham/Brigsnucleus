import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsHomeComponent } from './components/reports-home/reports-home.component';
import { MaterialModule } from 'src/app/app.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReportsNavigationComponent } from './components/reports-navigation/reports-navigation.component';
import { ReportsDetailsComponent } from './components/reports-details/reports-details.component';
import { PendingComplaintsComponent } from './components/reports-details/pending-complaints/pending-complaints.component';
import { PendingTasksComponent } from './components/reports-details/pending-tasks/pending-tasks.component';
import { CriticalConditionAssetsComponent } from './components/reports-details/critical-condition-assets/critical-condition-assets.component';
import { PendingMaintainanceAssetsComponent } from './components/reports-details/pending-maintainance-assets/pending-maintainance-assets.component';
import { AssetsComponent } from './components/reports-details/assets/assets.component';

@NgModule({
  declarations: [
    ReportsHomeComponent,
    ReportsNavigationComponent,
    ReportsDetailsComponent,
    PendingComplaintsComponent,
    PendingTasksComponent,
    CriticalConditionAssetsComponent,
    PendingMaintainanceAssetsComponent,
    AssetsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutingModule),
    MaterialModule,
    FlexLayoutModule
  ]
})
export class ReportsModule { }
