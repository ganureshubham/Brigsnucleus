import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../../../service/assetmate.service';
import { DataSharingService } from '../../../../../public service/data-sharing.service';
import { SpinnerService } from '../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { AppDialogData } from 'src/app/model/appDialogData';
import { DialogService } from '../../../../../public service/dialog.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AddAssignUserComponent } from './add-assign-user/add-assign-user.component';

@Component({
  selector: 'app-view-assign-user',
  templateUrl: './view-assign-user.component.html',
  styleUrls: ['./view-assign-user.component.css']
})
export class ViewAssignUserComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  assetData: any = {};
  showFirst: boolean = false;
  Router: any;
  categoryID: any;
  codeData: any;
  parentdata: any;
  result: string = '';
  nonzero: boolean = false;
  userCatAssignmentId;
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  isNoRecordFound: boolean = true;
  displayedColumns: string[] = ['firstName', 'lastName', 'assignmentType', 'Actions'];
  dataSource: MatTableDataSource<AssignUser> = new MatTableDataSource();
  mobileQuery: MediaQueryList;

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  dialogServiceSubscription: Subscription = null;
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
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.categoryID = this.route.snapshot.params['categoryId'];
    this.spinnerService.setSpinnerVisibility(true);
    this.getAllAssignUsers(this.pageNumber);
    this.spinnerService.setSpinnerVisibility(false);
  }

  ngOnDestroy() {
    if (this.dialogServiceSubscription) {
      this.dialogServiceSubscription.unsubscribe();
    }
  }

  /*********************************************************** Get All Assign Users *******************************************************************/

  getAllAssignUsers(pageNo: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getAllAssignUsers(pageNo, this.categoryID).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.assignedUsers) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = res.assignedUsers;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllAssignUsers(this.page);
  }


  /*********************************************************** Search Assign Users *******************************************************************/
  searchAssignUsers(keyword) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.assetmateService.searchAssignUsersToCategory(keyword, this.categoryID).subscribe(res => {
        if (res && res.data) {
          this.dataSource = res.data;
          this.isNoRecordFound = false;
        } else {
          this.dataSource = new MatTableDataSource<any>([]);
          this.isNoRecordFound = true;
        }

      },
        error => {
          console.log(error.errors.msg);
        })
    } else {
      if (this.nonzero == true) {
        this.nonzero = false;
        this.getAllAssignUsers(this.pageNumber);
      }
    }
  }

  /*********************************************************** Go to Add Asset Form *******************************************************************/
  addAsset() {
    const dialogRef = this.dialog.open(AddAssignUserComponent, {
      width: this.mobileQuery.matches ? '90vw' : '30vw',
      // height: this.mobileQuery.matches ? '90vh' : '60vh',
      disableClose: false,
      data: { categoryId: this.categoryID, action: "add" }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
        this.getAllAssignUsers(this.pageNumber);
      }
    });
  }

  /*********************************************************** Delete Particular Assign User *******************************************************************/
  deleteAssignUsers(userCatAssignmentId: number, firstName: string, lastName: string) {
    this.userCatAssignmentId = userCatAssignmentId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE CATEGORY ASSIGNED USER',
      message: `Are your sure you want to delete assigned user "${firstName + ' ' + lastName}" ?`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel",
      action: "category-assign-user"
    }
    this.dialogService.setDialogVisibility(appDialogData);
    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogServiceSubscription = this.dialogService.getUserDialogAction().subscribe((resp: any) => {
        if (resp.result == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (resp.result == 1) {
          if (resp.action == "category-assign-user") {
            this.dialogService.setUserDialogAction(0);
            //User has approved delete operation 
            this.spinnerService.setSpinnerVisibility(true);
            this.assetmateService.deleteAssignUsers(this.userCatAssignmentId).subscribe(res => {

              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar(res.message);
              this.assetmateService.setBadgeUpdateAction('assetList', true);
              this.getAllAssignUsers(this.page);

            }, error => {
              this.showSnackBar("Something went wrong..!!");
            });
          }

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

