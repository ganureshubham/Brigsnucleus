import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChecklistRoutingModule } from './checklist-routing.module';
import { ChecklistViewComponent } from './checklist-view/checklist-view.component';
import { AddChecklistComponent } from './checklist-view/add-checklist/add-checklist.component';

@NgModule({
  declarations: [ChecklistViewComponent, AddChecklistComponent],
  imports: [
    CommonModule,
    ChecklistRoutingModule
  ]
})
export class ChecklistModule { }
