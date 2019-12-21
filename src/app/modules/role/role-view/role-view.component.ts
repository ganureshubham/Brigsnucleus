import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RoleService } from '../service/role.service';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { SpinnerService } from '../../../public service/spinner.service';
import { AppDialogData } from '../../../model/appDialogData';
import { DialogService } from '../../../public service/dialog.service';
import { AddRoleComponent } from './add-role/add-role.component';

interface roleDialogData {
  userRoleId: number;
  title: string;
  type: string;
  features: string;
}

@Component({
  selector: 'app-role-view',
  templateUrl: './role-view.component.html',
  styleUrls: ['./role-view.component.css']
})

export class RoleViewComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  roleData: any = {};
  userRoleId: number;
  isNoRecordFound: boolean = false;
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  dialogData: roleDialogData;

  displayedColumns: string[] = ['title', 'features', 'Actions'];

  paidDataSource: MatTableDataSource<Role> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;

  dialogServiceSubscription: Subscription;

  constructor(
    private roleService: RoleService,
    public dataService: DataSharingService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    public dialog: MatDialog,
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getAllRoles(this.pageNumber);
  }

  ngOnDestroy() {
    this.dialogServiceSubscription.unsubscribe();
  }

  /*********************************************************** Get All Roles *******************************************************************/

  getAllRoles(pageNo: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.roleService.getAllRoles(pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        if ((res.currentPage == 0 && res.totalCount == 0)) {
          this.isNoRecordFound = true;
          this.showSnackBar(res.message, 2000);
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.userroles;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message, 2000);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!", 2000);
      }
    )
  }

  showSnackBar(message: string, duration: any) {
    this.snackBar.open(message, '', { duration: duration });
  }

  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllRoles(this.page);
  }

  /*********************************************************** Add Role *******************************************************************/

  addRole(): void {
    this.dialogData = {
      type: 'Add',
      userRoleId: 0,
      title: '',
      features: ''
    }
    const dialogRef = this.dialog.open(AddRoleComponent, {
      data: this.dialogData,
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllRoles(this.pageNumber);
      }
    });
  }

  /*********************************************************** Delete Particular Role *******************************************************************/

  deleteRole(userRoleId: number, title: string) {
    console.log('deleteRole : ', userRoleId);

    this.userRoleId = userRoleId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE USER ROLE',
      message: ` Are your sure you want to delete User Role "${title}"`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel",
      action: "role"
    }
    this.dialogService.setDialogVisibility(appDialogData);
    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogServiceSubscription = this.dialogService.getUserDialogAction().subscribe((resp: any) => {
        console.log('Action:::::  ' + resp.result + ' - ' + resp.action);
        if (resp.result == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (resp.result == 1) {
          if (resp.action == 'role') {
            this.dialogService.setUserDialogAction(0);
            //User has approved delete operation
            this.spinnerService.setSpinnerVisibility(true);
            console.log("Deletet Service :: ", this.userRoleId);
            this.roleService.deleteRole(this.userRoleId).subscribe(res => {
              this.spinnerService.setSpinnerVisibility(false);
              if (res.status) {
                this.showSnackBar(res.message, 4000);
                this.getAllRoles(this.page);
              } else {
                this.showSnackBar(res.message, 4000);
              }
            }, error => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar("Something went wrong..!!", 2000);
            });
          }
        }
      })
    }
  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/

  editRole(visit: any) {
    this.dialogData = {
      type: 'Edit',
      userRoleId: visit.userRoleId,
      title: visit.title,
      features: visit.features
    }
    const dialogRef = this.dialog.open(AddRoleComponent, {
      data: this.dialogData,
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllRoles(this.pageNumber);
      }
    })
  }

  getFeatureList(features: any) {
    let allfeaturelists = "";
    if (features != undefined && features != null && features.length > 0) {
      for (let i = 0; i < features.length; i++) {
        if (i < features.length - 1) {
          allfeaturelists += features[i].purpose + ', ';
        } else {
          allfeaturelists += features[i].purpose + ' ';
        }
      }
      return allfeaturelists
    } else {
      return allfeaturelists;
    }
  }

}

export interface Role {
  userRoleId: number;
  title: string;
}
