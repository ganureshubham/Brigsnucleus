import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { DashboardRoutes } from './dashboard.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSpinnerModule
  ]
})
export class DashboardModule { }
