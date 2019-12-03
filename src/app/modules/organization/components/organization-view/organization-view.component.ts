import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrganizationService } from '../../services/organization.service';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MediaMatcher } from '@angular/cdk/layout';

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

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private organizationService: OrganizationService,
    private spinnerService: SpinnerService
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
        this.arrOrganization = resp.organization;
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

}
