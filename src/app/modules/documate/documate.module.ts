import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumateRoutingModule } from './documate-routing.module';
import { DocumateViewComponent } from './documate-view/documate-view.component';
import { AddDocumateComponent } from './documate-view/add-documate/add-documate.component';

@NgModule({
  declarations: [DocumateViewComponent, AddDocumateComponent],
  imports: [
    CommonModule,
    DocumateRoutingModule
  ]
})
export class DocumateModule { }
