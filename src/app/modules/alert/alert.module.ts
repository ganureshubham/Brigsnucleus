import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertViewComponent } from './alert-view/alert-view.component';
import { AlertDetailsComponent } from './alert-view/alert-details/alert-details.component';
import { RouterModule } from '@angular/router';
import { AlertRoutes } from './alert-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppImgDialogComponent } from '../../shared/app-img-dialog/app-img-dialog.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [AlertViewComponent, AlertDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AlertRoutes),
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    SharedModule
  ],
  entryComponents: [AppImgDialogComponent]
})
export class AlertModule { }  
