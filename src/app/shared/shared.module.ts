import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppImgDialogComponent } from './app-img-dialog/app-img-dialog.component';
import { MaterialModule } from '../app.module';

@NgModule({
  declarations: [AppImgDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    AppImgDialogComponent
  ]
})
export class SharedModule { }
