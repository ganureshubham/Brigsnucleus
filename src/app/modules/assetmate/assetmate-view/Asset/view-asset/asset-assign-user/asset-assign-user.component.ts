import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../../../../service/assetmate.service';
import { DataSharingService } from '../../../../../../public service/data-sharing.service';
import { SpinnerService } from '../../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { AppDialogData } from 'src/app/model/appDialogData';
import { DialogService } from '../../../../../../public service/dialog.service';

@Component({
  selector: 'app-asset-assign-user',
  templateUrl: './asset-assign-user.component.html',
  styleUrls: ['./asset-assign-user.component.css']
})
export class AssetAssignUserComponent implements OnInit {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  assetData: any = {};
  showFirst: boolean = false;
  Router: any;
  assetId: any;
  codeData: any;
  parentdata: any;
  result: string = '';
  deleteUserWithAssignedId;
  isAlreadySubscribedToDialogUserActionService: boolean = false;

  displayedColumns: string[] = ['firstName', 'lastName', 'assignmentType', 'Actions'];
  dataSource: MatTableDataSource<AssignUser> = new MatTableDataSource();

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  animal: any;
  filepath: any;
  filedata: any = {};

  constructor(
    private route: ActivatedRoute,
    private assetmateService: AssetmateService,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.assetId = this.route.snapshot.params['assetId']
    this.getAllAssignUsers(this.pageNumber);
  }

  ngOnDestroy(): void { }

  /*********************************************************** Get All Assets *******************************************************************/

  getAllAssignUsers(pageNo: any) {

    this.spinnerService.setSpinnerVisibility(true);

    this.assetmateService.getAllAssignUsersToAsset(pageNo, this.assetId).subscribe(res => {

      this.spinnerService.setSpinnerVisibility(false);

      if (res.assignedUsers) {
        this.dataSource = res.assignedUsers;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message);
      }

    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  onNewUserAssignedToAsset(isNewUserAssignedTOAsset: boolean) {
    if (isNewUserAssignedTOAsset) {
      this.pageNumber = 0;
      this.getAllAssignUsers(this.pageNumber);
    }
    this.showFirst = !this.showFirst;
  }

  /*********************************************************** Page Change *******************************************************************/
  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllAssignUsers(this.page);
  }


  /*********************************************************** Search Category *******************************************************************/
  searchAssignUsers(keyword) {
    if (keyword) {
      this.assetmateService.searchAssignUsersToAsset(keyword, this.assetId).subscribe(res => {
        this.dataSource = res.data;
      }, error => {
        console.log(error);
      })
    } else {
      this.getAllAssignUsers(this.pageNumber);
    }
  }


  /*********************************************************** Go to Add Asset Form *******************************************************************/
  addAsset() {
    this.showFirst = !this.showFirst;
    let selectedAsset = null;
    this.dataService.saveData(selectedAsset);
  }

  /*********************************************************** Delete Particular Asset *******************************************************************/
  deleteAssignUsers(userCatAssignmentId: number, userFirstName: string, userLastName: string) {

    this.deleteUserWithAssignedId = userCatAssignmentId;

    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE ASSET ASSIGNED USER',
      message: `Are your sure you want to delete user "${userFirstName + ' ' + userLastName}"?`,
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
          this.assetmateService.deleteAssignUsers(this.deleteUserWithAssignedId).subscribe(res => {

            this.spinnerService.setSpinnerVisibility(false);
            this.assetmateService.setBadgeUpdateAction('assetDetails', true);
            this.showSnackBar(res.message);

            this.getAllAssignUsers(this.page);

          }, error => {
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }

  }

}

export interface AssignUser {
  firstName: string;
  lastName: string;
  assignmentType: string;
}