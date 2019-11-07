import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetmateViewComponent } from './assetmate-view/assetmate-view.component';
import { AssetmateDetailsComponent } from './assetmate-view/assetmate-details/assetmate-details.component';
import { RouterModule } from '@angular/router';
import { AssetmateRoutes } from './assetmate-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';
import { AssetModule } from '../asset/asset.module';
import { AssetmateLayoutComponent } from './assetmate-layout/assetmate-layout.component';
import { ViewAssetComponent } from './assetmate-view/Asset/view-asset/view-asset.component';
import { AssetAddComponent } from './assetmate-view/Asset/view-asset/asset-add/asset-add.component';
import { DetailsAssetComponent } from './assetmate-view/Asset/view-asset/details-asset/details-asset.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { AssetCodeComponent } from './assetmate-view/Asset/asset-code/asset-code.component';
import { ViewChecklistComponent } from './assetmate-view/checklist/view-checklist/view-checklist.component';
import { ChecklistAddComponent } from './assetmate-view/checklist/view-checklist/checklist-add/checklist-add.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ViewCategoryDocumentComponent } from './assetmate-view/category-document/view-category-document/view-category-document.component';
import { AddCategoryDocumentComponent } from './assetmate-view/category-document/view-category-document/add-category-document/add-category-document.component';
import { ViewAssignUserComponent } from './assetmate-view/Assigned-User/view-assign-user/view-assign-user.component';
import { AddAssignUserComponent } from './assetmate-view/Assigned-User/view-assign-user/add-assign-user/add-assign-user.component';
import { FilterCategoryComponent } from './filter-category/filter-category.component';
import { ViewAssetDocumentComponent } from './assetmate-view/Asset/view-asset/asset-document/view-asset-document/view-asset-document.component';
import { AddAssetDocumentComponent } from './assetmate-view/Asset/view-asset/asset-document/view-asset-document/add-asset-document/add-asset-document.component';
import { ViewHistoryComponent } from './assetmate-view/Asset/view-asset/History/view-history/view-history.component';
import { ViewQuestionComponent } from './assetmate-view/Asset/view-asset/History/view-history/view-question/view-question.component';


@NgModule({
  declarations: [
    AssetmateViewComponent,
    AssetmateDetailsComponent,
    AssetmateLayoutComponent,
    ViewAssetComponent,
    AssetAddComponent,
    DetailsAssetComponent,
    AssetCodeComponent,
    ViewChecklistComponent,
    ChecklistAddComponent,
    ViewCategoryDocumentComponent,
    AddCategoryDocumentComponent,
    ViewAssignUserComponent,
    AddAssignUserComponent,
    FilterCategoryComponent,
    ViewAssetDocumentComponent,
    AddAssetDocumentComponent,
    ViewHistoryComponent,
    ViewQuestionComponent,  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AssetmateRoutes),
    MaterialModule,
    FormsModule,
    NgxSpinnerModule,
    QRCodeModule
  ],
  entryComponents: [AssetCodeComponent,ConfirmDialogComponent]
})
export class AssetmateModule { } 
