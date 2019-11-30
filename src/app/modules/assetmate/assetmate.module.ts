import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetmateViewComponent } from './assetmate-view/assetmate-view.component';
import { AssetmateDetailsComponent } from './assetmate-view/assetmate-details/assetmate-details.component';
import { RouterModule } from '@angular/router';
import { AssetmateRoutes } from './assetmate-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AssetAssignUserComponent } from './assetmate-view/Asset/view-asset/asset-assign-user/asset-assign-user.component';
import { AssetAssignNewUsersComponent } from './assetmate-view/Asset/view-asset/asset-assign-user/asset-assign-new-users/asset-assign-new-users.component';
import { ViewChecklistQuestionsComponent } from './assetmate-view/checklist/view-checklist-questions/view-checklist-questions.component';
import { ChecklistQuestionListComponent } from './assetmate-view/checklist/view-checklist-questions/checklist-question-list/checklist-question-list.component';
import { AddChecklistQuestionComponent } from './assetmate-view/checklist/view-checklist-questions/add-checklist-question/add-checklist-question.component';
import { EditChecklistQuestionComponent } from './assetmate-view/checklist/view-checklist-questions/edit-checklist-question/edit-checklist-question.component';
import { DetailsChecklistQuestionComponent } from './assetmate-view/checklist/view-checklist-questions/details-checklist-question/details-checklist-question.component';
import { FlexLayoutModule } from "@angular/flex-layout";

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
    AssetAssignUserComponent,
    AssetAssignNewUsersComponent,
    ViewChecklistQuestionsComponent,
    ChecklistQuestionListComponent,
    AddChecklistQuestionComponent,
    EditChecklistQuestionComponent,
    DetailsChecklistQuestionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AssetmateRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    QRCodeModule,
    FlexLayoutModule
  ],
  entryComponents: [AssetCodeComponent, ConfirmDialogComponent, AssetAddComponent, AddAssetDocumentComponent]
})
export class AssetmateModule { } 
