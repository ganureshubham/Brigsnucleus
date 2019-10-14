import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetViewComponent } from './asset-view/asset-view.component';
import { AddAssetComponent } from './asset-view/add-asset/add-asset.component';
import { AssetDetailsComponent } from './asset-view/asset-details/asset-details.component';



export const AssetRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component:AssetViewComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "add-asset",
        component: AddAssetComponent  
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "asset-details",
        component: AssetDetailsComponent  
      }
    ]
  },
];
