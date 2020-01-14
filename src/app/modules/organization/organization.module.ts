import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from '../../app.module';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationViewComponent } from './components/organization-view/organization-view.component';
import { OrganizationAddEditComponent } from './components/organization-add-edit/organization-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganizationConfigureComponent } from './components/organization-configure/organization-configure.component';

@NgModule({
  declarations: [OrganizationViewComponent, OrganizationAddEditComponent, OrganizationConfigureComponent],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    OrganizationAddEditComponent,
    OrganizationConfigureComponent
  ]
})
export class OrganizationModule { }
