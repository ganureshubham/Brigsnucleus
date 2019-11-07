import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistViewComponent } from './checklist-view/checklist-view.component';
import { AddChecklistComponent } from './checklist-view/add-checklist/add-checklist.component';
import { RouterModule } from '@angular/router';
import { ChecklistRoutes } from './checklist-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ChecklistViewComponent, AddChecklistComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ChecklistRoutes),
    MaterialModule,
    FormsModule
  ]
})
export class ChecklistModule { }
