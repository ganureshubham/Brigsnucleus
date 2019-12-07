import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppImgDialogComponent } from './app-img-dialog/app-img-dialog.component';
import { MaterialModule } from '../app.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [AppImgDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    AppImgDialogComponent
  ]
})
export class SharedModule { }
