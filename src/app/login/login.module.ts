import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutes } from './login.routing';
// import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    // LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(LoginRoutes),
    FormsModule,
    MaterialModule,
    HttpClientModule,
    NgxSpinnerModule


  ]
})
export class LoginModule { }
