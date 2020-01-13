import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppImgDialogComponent } from './app-img-dialog/app-img-dialog.component';
import { MaterialModule } from '../app.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DocViewerDialogComponent } from './doc-viewer-dialog/doc-viewer-dialog.component';

@NgModule({
  declarations: [AppImgDialogComponent, DocViewerDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    AppImgDialogComponent, DocViewerDialogComponent
  ]
})
export class SharedModule { }
