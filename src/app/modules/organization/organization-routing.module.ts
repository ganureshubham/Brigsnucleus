import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationViewComponent } from './components/organization-view/organization-view.component';

const routes: Routes = [
  {
    path: "",
    component: OrganizationViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { } 
