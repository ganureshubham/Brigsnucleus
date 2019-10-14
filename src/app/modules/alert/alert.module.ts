import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertViewComponent } from './alert-view/alert-view.component';
import { AlertDetailsComponent } from './alert-view/alert-details/alert-details.component';
import { RouterModule } from '@angular/router';
import { AlertRoutes } from './alert-routing.module';
import { MaterialModule } from '../../app.module';

@NgModule({
  declarations: [AlertViewComponent, AlertDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AlertRoutes),
    MaterialModule
  ]
})
export class AlertModule { }  
