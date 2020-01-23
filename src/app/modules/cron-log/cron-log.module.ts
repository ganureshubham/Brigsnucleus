import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CronLogRoutingModule } from './cron-log-routing.module';
import { ViewCronLogsComponent } from './components/view-cron-logs/view-cron-logs.component';
import { MaterialModule } from '../../app.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewCronLogsComponent],
  imports: [
    CommonModule,
    CronLogRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule
  ]
})
export class CronLogModule { } 
