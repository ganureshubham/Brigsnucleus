import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { OrganizationService } from '../../services/organization.service';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { OrganizationAddEditComponent } from '../organization-add-edit/organization-add-edit.component';
import { AppDialogData } from 'src/app/model/appDialogData';
import { DialogService } from '../../../../public service/dialog.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization-view',
  templateUrl: './organization-view.component.html',
  styleUrls: ['./organization-view.component.css']
})
export class OrganizationViewComponent implements OnInit {

  page: number = 0;
  arrOrganization: any[] = [];
  mSearchOrganization: any = [];
  isNoRecordFound: boolean = false;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  tabQuery: MediaQueryList;
  screen_1366x768Query: MediaQueryList;
  screen_1920x1080Query: MediaQueryList;
  isSearchRequestAllowed: boolean = true;
  pageNumber = 0;
  totalCount = 0;
  displayedColumns: string[] = ['OrganizationName', 'OrganizationCode', 'CreatedOn', 'OrganizationDescription', 'TotalAdmins', 'TotalAssets', 'TotalUsers', 'Actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  deleteOrgId: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private organizationService: OrganizationService,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.tabQuery = media.matchMedia('(max-width: 768px)');
    this.screen_1366x768Query = media.matchMedia('(max-width: 1366px)');
    this.screen_1920x1080Query = media.matchMedia('(max-width: 1920px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.getListOfOrganizations(this.pageNumber);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getListOfOrganizations(pageNumber) {
    this.spinnerService.setSpinnerVisibility(true);
    this.organizationService.getListOfOrganizations(pageNumber).subscribe((resp: any) => {
      this.spinnerService.setSpinnerVisibility(false);
      if (resp && resp.organizations) {
        if (resp.currentPage == 0 && resp.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = resp.organizations;
        this.pageNumber = resp.currentPage;
        this.totalCount = resp.totalCount;
      } else {
        this.showSnackBar(resp.message);
      }
    },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar('Something went wrong..!!');
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
          this.dataSource = res.data;
          this.isNoRecordFound = false;
        } else {
          this.dataSource = new MatTableDataSource<object>([]);
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
        this.getListOfOrganizations(this.pageNumber);
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
        this.getListOfOrganizations(this.pageNumber);
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
        this.getListOfOrganizations(this.pageNumber);
      }
    });
  }

  deleteOrganization(organization) {

    this.deleteOrgId = organization.organizationId;
    let deleteOrgTitle = organization.organizationName;

    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE ORGANIZATION',
      message: `Are your sure you want to delete organization "${deleteOrgTitle}" ?`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel"
    }

    this.dialogService.setDialogVisibility(appDialogData);

    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogService.getUserDialogAction().subscribe(userAction => {
        if (userAction == 0) {
          //User has not performed any action on opened app dialog or closed the dialog; 
        } else if (userAction == 1) {

          this.dialogService.setUserDialogAction(0);

          //User has approved delete operation 
          this.spinnerService.setSpinnerVisibility(true);
          this.organizationService.deleteOrganization(this.deleteOrgId).subscribe(res => {

            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.getListOfOrganizations(this.page);

          }, error => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar("Something went wrong..!!");
          });

        }
      })
    }

  }

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getListOfOrganizations(this.page);
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  goToParticularOrganization(organizationId) {
    this.spinnerService.setSpinnerVisibility(true);
    this.organizationService.getOrganizationSpecificToken(organizationId).subscribe((resp: any) => {
      this.spinnerService.setSpinnerVisibility(false);
      if (resp.status) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.data.token = resp.token;
        currentUser.data.OrgNameForSuperAdmin = resp.organizationName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.router.navigate(['/dashboard/admin']);
      } else {
        this.showSnackBar("Something went wrong..!!");
      }
    }, err => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar("Something went wrong..!!");
    });
  }

}