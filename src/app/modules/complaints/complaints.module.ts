import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintRoutes } from './complaints-routing.module';
import { ViewComplaintsComponent } from './components/view-complaints/view-complaints.component';
import { AddComplaintsComponent } from './components/add-complaints/add-complaints.component';
import { DetailsComplaintsComponent } from './components/details-complaints/details-complaints.component';
import { ViewComplaintTrackComponent } from './components/view-complaint-track/view-complaint-track.component';
import { ViewTransferComplaintComponent } from './components/view-transfer-complaint/view-transfer-complaint.component';
import { AddTransferComplaintComponent } from './components/add-transfer-complaint/add-transfer-complaint.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { AppImgDialogComponent } from 'src/app/shared/app-img-dialog/app-img-dialog.component';

@NgModule({
  declarations: [
    ViewComplaintsComponent,
    AddComplaintsComponent,
    DetailsComplaintsComponent,
    ViewComplaintTrackComponent,
    ViewTransferComplaintComponent,
    AddTransferComplaintComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ComplaintRoutes),
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    SharedModule
  ],
  entryComponents: [AddComplaintsComponent, AddTransferComplaintComponent, AppImgDialogComponent]
})
export class ComplaintsModule { } 