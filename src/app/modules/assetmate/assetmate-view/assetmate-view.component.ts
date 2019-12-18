import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../service/assetmate.service';
import { DataSharingService } from '../../../public service/data-sharing.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { SpinnerService } from '../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-assetmate-view',
  templateUrl: './assetmate-view.component.html',
  styleUrls: ['./assetmate-view.component.css']
})
export class AssetmateViewComponent implements OnInit {
  category: any = [];
  mSearchCategory: any = [];
  isNoRecordFound: boolean = false;
  nonzero: boolean = false;


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
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
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


  /*********************************************************** Get all Root Category *******************************************************************/

  getRootCategoryList() {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getAllRootCateg().subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.rootCategory) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.category = res.rootCategory;
      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }



  categoryDetail(categoryId: any) {
    // let categoryObj=categ;
    // localStorage.setItem('Category-Object',JSON.stringify(categoryObj));
    // this.dataService.changeData(categ);
    this.router.navigate(['/assetmate/assetmate-details/' + categoryId]);
  }


  /*********************************************************** Search Category *******************************************************************/


  searchCategory(keyword) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.assetmateService.searchCategory(keyword).subscribe(res => {
        if (res && res.data) {
          this.category = res.data;
          this.isNoRecordFound = false;
        } else {
          this.category = [];
          this.isNoRecordFound = true;
        }

      },
        error => {
          console.log(error.errors.msg);
        })
    } else {
      if (this.nonzero == true) {
        this.nonzero = false;
        this.getRootCategoryList();
      }
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
