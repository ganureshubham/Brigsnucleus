import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsHomeComponent } from './components/reports-home/reports-home.component';

@NgModule({
  declarations: [ReportsHomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutingModule),
  ]
})
export class ReportsModule { }
