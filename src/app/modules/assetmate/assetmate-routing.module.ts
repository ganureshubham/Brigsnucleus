import { Routes } from '@angular/router';
import { AssetmateViewComponent } from './assetmate-view/assetmate-view.component';
import { AssetmateDetailsComponent } from './assetmate-view/assetmate-details/assetmate-details.component';
import { AssetmateLayoutComponent } from './assetmate-layout/assetmate-layout.component';
import { AssetCodeComponent } from './assetmate-view/Asset/asset-code/asset-code.component';
import { DetailsAssetComponent } from './assetmate-view/Asset/view-asset/details-asset/details-asset.component';
import { ViewChecklistQuestionsComponent } from './assetmate-view/checklist/view-checklist-questions/view-checklist-questions.component';
import { ChecklistQuestionListComponent } from './assetmate-view/checklist/view-checklist-questions/checklist-question-list/checklist-question-list.component';
import { AddChecklistQuestionComponent } from './assetmate-view/checklist/view-checklist-questions/add-checklist-question/add-checklist-question.component';
import { EditChecklistQuestionComponent } from './assetmate-view/checklist/view-checklist-questions/edit-checklist-question/edit-checklist-question.component';
import { DetailsChecklistQuestionComponent } from './assetmate-view/checklist/view-checklist-questions/details-checklist-question/details-checklist-question.component';

export const AssetmateRoutes: Routes = [
  {
    // path: "",
    // children: [
    //   {
    path: "",
    component: AssetmateViewComponent
    //   }
    // ]
  },
  {
    // path: "",
    // children: [
    //   {
    path: "assetmate-details/:categoryId",
    component: AssetmateDetailsComponent
    //   }
    // ]
  },
  {
    // path: "",
    // children: [
    //   {
    path: "assetcode",
    component: AssetCodeComponent
    //   }
    // ]
  },
  {
    // path: "",
    // children: [
    //   {
    path: "assetmate-details/:categoryId/asset-details/:assetId",
    component: DetailsAssetComponent
    //   }
    // ]
  },
  {
    // path: "",
    // children: [
    //   {
    path: "assetmate-details/:categoryId/checklist/:checkListId",
    component: ViewChecklistQuestionsComponent,
    children: [
      {
        path: "",
        component: ChecklistQuestionListComponent,
      },
      {
        path: "add-question/:questionId",
        component: AddChecklistQuestionComponent,
      },
      {
        path: "edit-question/:questionId",
        component: EditChecklistQuestionComponent,
      },
      {
        path: "details-question/:questionId",
        component: DetailsChecklistQuestionComponent,
      }
    ]
    //   }
    // ]
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