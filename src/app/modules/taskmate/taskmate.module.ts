import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewTaskmateComponent } from './components/view-taskmate/view-taskmate.component';
import { AddTaskmateComponent } from './components/add-taskmate/add-taskmate.component';
import { DetailsTaskmateComponent } from './components/details-taskmate/details-taskmate.component';
import { ViewTaskmateTrackComponent } from './components/view-taskmate-track/view-taskmate-track.component';
import { ViewTaskmateTransferComponent } from './components/view-taskmate-transfer/view-taskmate-transfer.component';
import { AddTaskmateTransferComponent } from './components/add-taskmate-transfer/add-taskmate-transfer.component';
import { RouterModule } from '@angular/router';
import { TaskmateRoutes } from './taskmate-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppImgDialogComponent } from 'src/app/shared/app-img-dialog/app-img-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ViewTaskmateComponent,
    AddTaskmateComponent,
    DetailsTaskmateComponent,
    ViewTaskmateTrackComponent,
    ViewTaskmateTransferComponent,
    AddTaskmateTransferComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(TaskmateRoutes),
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    SharedModule
  ],
  entryComponents: [AddTaskmateComponent, AddTaskmateTransferComponent, AppImgDialogComponent]
})
export class TaskmateModule { } 
