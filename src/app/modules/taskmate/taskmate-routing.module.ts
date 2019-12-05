import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewTaskmateComponent } from './components/view-taskmate/view-taskmate.component';
import { DetailsTaskmateComponent } from './components/details-taskmate/details-taskmate.component';

export const TaskmateRoutes: Routes = [
  {
    path: '',
    component: ViewTaskmateComponent,
  },

  {
    path: 'details-taskmate/:complaintId',
    component: DetailsTaskmateComponent,
  }


]