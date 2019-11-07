import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManufacturerViewComponent } from './manufacturer-view/manufacturer-view.component';
import { AddManufacturerComponent } from './manufacturer-view/add-manufacturer/add-manufacturer.component';
import { RouterModule } from '@angular/router';
import { ManufacturerRoutes } from './manufacturer-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [ManufacturerViewComponent, AddManufacturerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ManufacturerRoutes),
    MaterialModule,
    FormsModule,
    NgxSpinnerModule
  ]
})
export class ManufacturerModule { }
