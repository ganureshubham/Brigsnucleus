import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../service/assetmate.service';
import { DataSharingService } from '../../../public service/data-sharing.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-assetmate-view',
  templateUrl: './assetmate-view.component.html',
  styleUrls: ['./assetmate-view.component.css']
})
export class AssetmateViewComponent implements OnInit {
  category: any = [];
  mSearchCategory: any = [];

  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  tabQuery: MediaQueryList;
  screen_1366x768Query: MediaQueryList;
  screen_1920x1080Query: MediaQueryList;

  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private assetmateService: AssetmateService,
    private router: Router,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.tabQuery = media.matchMedia('(max-width: 768px)');
    this.screen_1366x768Query = media.matchMedia('(max-width: 1366px)');
    this.screen_1920x1080Query = media.matchMedia('(max-width: 1920px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.getRootCategoryList();
  }

  mediaQueryListener = () => {
    console.log('mediaQueryListener');
  }

  getRootCategoryList() {
    this.assetmateService.getAllRootCateg().subscribe(res => {
      console.log('Root category list')
      console.log(res);

      this.category = res.rootCategory;
    })
  }

  categoryDetail(categoryId: any) {
    // let categoryObj=categ;
    // localStorage.setItem('Category-Object',JSON.stringify(categoryObj));
    // this.dataService.changeData(categ);
    this.router.navigate(['/assetmate/assetmate-details/' + categoryId]);
  }


  /*********************************************************** Search Category *******************************************************************/

  searchCategory(keyword) {
    if (keyword) {
      this.assetmateService.searchCategory(keyword).subscribe(res => {
        if (res && res.data) {
          this.category = res.data;
        }
      },
        error => {
          console.log(error.error.message);
          this.toastr.error(error.error.message);
        })
    } else {
      this.getRootCategoryList();
    }
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
