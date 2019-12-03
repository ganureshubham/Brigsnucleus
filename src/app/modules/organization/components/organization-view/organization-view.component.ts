import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { OrganizationService } from '../../services/organization.service';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { OrganizationAddEditComponent } from '../organization-add-edit/organization-add-edit.component';

@Component({
  selector: 'app-organization-view',
  templateUrl: './organization-view.component.html',
  styleUrls: ['./organization-view.component.css']
})
export class OrganizationViewComponent implements OnInit {

  arrOrganization: any[] = [];
  mSearchOrganization: any = [];
  isNoRecordFound: boolean = false;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  tabQuery: MediaQueryList;
  screen_1366x768Query: MediaQueryList;
  screen_1920x1080Query: MediaQueryList;
  isSearchRequestAllowed: boolean = true;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private organizationService: OrganizationService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.tabQuery = media.matchMedia('(max-width: 768px)');
    this.screen_1366x768Query = media.matchMedia('(max-width: 1366px)');
    this.screen_1920x1080Query = media.matchMedia('(max-width: 1920px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.getAllOrganizations();
  }

  getAllOrganizations() {
    this.spinnerService.setSpinnerVisibility(true);
    this.organizationService.getAllOrganizations().subscribe((resp: any) => {
      this.spinnerService.setSpinnerVisibility(false);
      // console.log(resp);
      if (resp && resp.organization) {
        if (resp.organization.length > 0) {
          this.isNoRecordFound = false;
          this.arrOrganization = resp.organization;
        } else {
          this.isNoRecordFound = true;
        }
      }
    },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
      })
  }

  getColumnCount() {
    //Mobile Screen
    if (this.mobileQuery.matches) {
      return 1;
    }
    //Tablet screen
    else if (this.tabQuery.matches) {
      return 2;
    }
    //1366 resolution screen
    else if (this.screen_1366x768Query.matches) {
      return 4;
    }
    //1920 resolution screen
    else if (this.screen_1920x1080Query.matches) {
      return 5;
    }
  }

  searchOrganization(keyword) {
    if (keyword) {
      this.isSearchRequestAllowed = true;
      this.spinnerService.setSpinnerVisibility(true);
      this.organizationService.searchOrganization(keyword).subscribe(res => {
        this.spinnerService.setSpinnerVisibility(false);
        if (res && res.data) {
          this.arrOrganization = [];
          this.arrOrganization = res.data;
          this.isNoRecordFound = false;
        } else {
          this.arrOrganization = [];
          this.isNoRecordFound = true;
        }
      },
        error => {
          this.spinnerService.setSpinnerVisibility(false);
        })
    } else {
      if (this.isSearchRequestAllowed) {
        this.isNoRecordFound = false;
        this.isSearchRequestAllowed = false;
        this.getAllOrganizations();
      }
    }
  }

  addNewOrganization() {
    const dialogRef = this.dialog.open(OrganizationAddEditComponent, {
      width: this.mobileQuery.matches ? '90vw' : '30vw',
      disableClose: true,
      data: { action: "add" }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
        this.getAllOrganizations();
      }
    });
  }

  editOrganization(organization) {
    const dialogRef = this.dialog.open(OrganizationAddEditComponent, {
      width: this.mobileQuery.matches ? '90vw' : '30vw',
      disableClose: true,
      data: { action: "edit", organization: organization }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
        this.getAllOrganizations();
      }
    });
  }

}