import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumateViewComponent } from './documate-view/documate-view.component';
import { AddDocumateComponent } from './documate-view/add-documate/add-documate.component';
import { RouterModule } from '@angular/router';
import { DocumateRoutes } from './documate-routing.module';
import { MaterialModule } from '../../app.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QRCodeModule } from 'angularx-qrcode';
import { DocumateCodeComponent } from './documate-code/documate-code.component';

@NgModule({
  declarations: [DocumateViewComponent, AddDocumateComponent, DocumateCodeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DocumateRoutes),
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    QRCodeModule
  ],
  entryComponents: [DocumateCodeComponent]
})
export class DocumateModule { } 
