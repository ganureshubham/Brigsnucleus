import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemAdminsViewComponent } from './components/system-admins-view/system-admins-view.component';

const routes: Routes = [
  {
    path: "",
    component: SystemAdminsViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemAdminsRoutingModule { }
