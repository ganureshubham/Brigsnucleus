import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierViewComponent } from './supplier-view/supplier-view.component';
import { AddSupplierComponent } from './supplier-view/add-supplier/add-supplier.component';
import { RouterModule } from '@angular/router';
import { SupplierRoutes } from './supplier-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SupplierViewComponent, AddSupplierComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SupplierRoutes),
    MaterialModule,
    FormsModule,
    
    
  ]
})
export class SupplierModule { }
