import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetDocumentRoutingModule } from './asset-document-routing.module';
import { AssetDocumentViewComponent } from './asset-document-view/asset-document-view.component';
import { AddAssetDocumentComponent } from './asset-document-view/add-asset-document/add-asset-document.component';

@NgModule({
  declarations: [AssetDocumentViewComponent, AddAssetDocumentComponent],
  imports: [
    CommonModule,
    AssetDocumentRoutingModule
  ]
})
export class AssetDocumentModule { }
