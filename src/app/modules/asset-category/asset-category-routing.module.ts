import { Routes } from '@angular/router';
import { AssetCategoryViewComponent } from './asset-category-view/asset-category-view.component';
import { AddAssetCategoryComponent } from './asset-category-view/add-asset-category/add-asset-category.component';




export const AssetCategoryRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component:AssetCategoryViewComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "add-asset-category",
        component: AddAssetCategoryComponent  
      }
    ]
  }
];
