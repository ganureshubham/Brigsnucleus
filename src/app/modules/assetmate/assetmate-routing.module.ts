import { Routes } from '@angular/router';
import { AssetmateViewComponent } from './assetmate-view/assetmate-view.component';
import { AssetmateDetailsComponent } from './assetmate-view/assetmate-details/assetmate-details.component';
import { AssetmateLayoutComponent } from './assetmate-layout/assetmate-layout.component';
import { AssetCodeComponent } from './assetmate-view/Asset/asset-code/asset-code.component';
import { DetailsAssetComponent } from './assetmate-view/Asset/view-asset/details-asset/details-asset.component';

export const AssetmateRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component:AssetmateViewComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "assetmate-details/:categoryId",
        component: AssetmateDetailsComponent   
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "assetcode",
        component: AssetCodeComponent   
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "assetmate-details/:categoryId/asset-details/:assetId",
        component: DetailsAssetComponent   
      }
    ]
  },
  // {
  //   path: "assetmate-layout",
  //   component:AssetmateLayoutComponent,
  //   children: [
  //     {
  //       path: "assetmate-details",
  //       component: AssetmateDetailsComponent   
  //     },
  //     {
  //       path:"add-asset",
  //       component:AssetAddComponent
  //     },
  //     {
  //       path:"view-asset",
  //       component:ViewAssetComponent
  //     }
  //   ]
  // },
  
];