import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemAdminsRoutingModule } from './system-admins-routing.module';
import { SystemAdminsViewComponent } from './components/system-admins-view/system-admins-view.component';
import { SystemAdminsAddEditComponent } from './components/system-admins-add-edit/system-admins-add-edit.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../app.module';

@NgModule({
  declarations: [SystemAdminsViewComponent, SystemAdminsAddEditComponent],
  imports: [
    CommonModule,
    SystemAdminsRoutingModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  entryComponents: [SystemAdminsAddEditComponent]
})
export class SystemAdminsModule { }
