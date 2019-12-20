import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyAssetListComponent } from './components/verify-asset-list/verify-asset-list.component';
import { RouterModule } from '@angular/router';
import { VerifyAssetRoutes } from './verify-asset-routing.module';
import { MaterialModule } from '../../app.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [VerifyAssetListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(VerifyAssetRoutes),
    MaterialModule,
    FlexLayoutModule,
    FormsModule
  ]
})
export class VerifyAssetModule { }  
