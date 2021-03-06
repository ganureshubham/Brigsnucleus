import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { DashboardRoutes } from './dashboard.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { SuperadminDashboardComponent } from './superadmin-dashboard/superadmin-dashboard.component';

@NgModule({
  declarations: [DashboardComponent, SuperadminDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSpinnerModule,
    FlexLayoutModule
  ]
})
export class DashboardModule { }
