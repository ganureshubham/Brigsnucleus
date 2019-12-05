import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemAdminsRoutingModule } from './system-admins-routing.module';
import { SystemAdminsViewComponent } from './components/system-admins-view/system-admins-view.component';
import { SystemAdminsAddEditComponent } from './components/system-admins-add-edit/system-admins-add-edit.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SystemAdminsViewComponent, SystemAdminsAddEditComponent],
  imports: [
    CommonModule,
    SystemAdminsRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [SystemAdminsAddEditComponent]
})
export class SystemAdminsModule { }
