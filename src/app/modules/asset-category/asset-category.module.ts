import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { AssetCategoryRoutes } from './asset-category-routing.module';
import { AssetCategoryViewComponent } from './asset-category-view/asset-category-view.component';
import { AddAssetCategoryComponent } from './asset-category-view/add-asset-category/add-asset-category.component';
import { MaterialModule } from 'src/app/app.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AssetCategoryViewComponent, AddAssetCategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AssetCategoryRoutes),
    MaterialModule,
    FormsModule,
    FlexLayoutModule
  ]
})
export class AssetCategoryModule { }
