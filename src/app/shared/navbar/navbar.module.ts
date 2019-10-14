import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { MatToolbarModule, MatMenuModule, MatIconModule, MatButtonModule, MatButtonToggleModule } from '@angular/material';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    
    
    
  ],
  exports : [NavbarComponent]
})
export class NavbarModule { }
