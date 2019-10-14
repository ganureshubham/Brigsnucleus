import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetRoutes } from './asset-routing.module';
import { AssetViewComponent } from './asset-view/asset-view.component';
import { AddAssetComponent } from './asset-view/add-asset/add-asset.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';
import { AssetDetailsComponent } from './asset-view/asset-details/asset-details.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';


@NgModule({
  declarations: [AssetViewComponent, AddAssetComponent, AssetDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AssetRoutes),
    MaterialModule,
    FormsModule,
    MaterialFileInputModule

  ]
  
})
export class AssetModule { }
