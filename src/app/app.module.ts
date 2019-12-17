import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutes } from './app-routing.module';
import { AppComponent, AppDialog } from './app.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NavbarModule } from './shared/navbar/navbar.module';
import { AuthenticationService } from './public service/authentication.service';
import { ConfigurationService } from './public service/configuration.service';
import { AuthInterceptor } from './guards/auth.interceptor';
import { MaterialFileInputModule, NGX_MAT_FILE_INPUT_CONFIG } from 'ngx-material-file-input';
import { ToastrModule } from 'ngx-toastr';
import { QRCodeModule } from 'angularx-qrcode';
import { FlexLayoutModule } from "@angular/flex-layout";

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MatDatepickerModule,
  MatTreeModule,
  MatBadgeModule
} from '@angular/material';
import { config, from } from 'rxjs';
import { NgxSpinnerModule } from "ngx-spinner";
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { PagenotfoundComponent } from './shared/pagenotfound/pagenotfound.component';
import { ManageOrganizationComponent } from './shared/manage-organization/manage-organization.component';


@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatBadgeModule
  ],
  declarations: [ConfirmDialogComponent],
  imports: []
})
export class MaterialModule { }

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    LoginComponent,
    AppDialog,
    PagenotfoundComponent,
    ManageOrganizationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    HttpModule,
    QRCodeModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, { useHash: true }),
    NavbarModule,
    MaterialFileInputModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    FlexLayoutModule
  ],
  exports: [MaterialModule],
  providers: [
    AuthenticationService,
    ConfigurationService,
    { provide: NGX_MAT_FILE_INPUT_CONFIG, useValue: config },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [AppDialog, ManageOrganizationComponent],
})
export class AppModule { }
