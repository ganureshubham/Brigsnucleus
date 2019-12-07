import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewLocationTypeComponent } from './components/view-location-type/view-location-type.component';
import { AddLocationTypeComponent } from './components/add-location-type/add-location-type.component';
import { RouterModule } from '@angular/router';
import { LocationTypeRoutes } from './location-type-routing.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../app.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [ViewLocationTypeComponent, AddLocationTypeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(LocationTypeRoutes),
    FormsModule,
    MaterialModule,
    FlexLayoutModule

  ],
  entryComponents: [AddLocationTypeComponent]
})
export class LocationTypeModule { } 
