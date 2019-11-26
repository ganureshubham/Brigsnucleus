import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../../../service/assetmate.service';
import { DataSharingService } from '../../../../../public service/data-sharing.service';
import { SpinnerService } from '../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { AppDialogData } from 'src/app/model/appDialogData';
import { DialogService } from '../../../../../public service/dialog.service';

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
  userCatAssignmentId;
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  isNoRecordFound: boolean = true;





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
    private dialogService: DialogService
  ) {

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

  ngOnDestroy(): void { }

  /*********************************************************** Get All Assets *******************************************************************/

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


  /*********************************************************** Search Category *******************************************************************/
  searchAssignUsers(keyword) {
    if (keyword) {
      this.assetmateService.searchAssignUsersToCategory(keyword, this.categoryID).subscribe(res => {
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
  deleteAssignUsers(userCatAssignmentId: number, firstName: string, lastName: string) {

    // this.assetmateService.deleteAssignUsers(userCatAssignmentId).subscribe(res => {
    //   this.toastr.success(res.message);
    //   this.getAllAssignUsers(this.page);
    // })
    // error => {
    //   this.toastr.error(error.message);
    // }

    this.userCatAssignmentId = userCatAssignmentId;

    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE CATEGORY ASSIGNED USER',
      message: `Are your sure you want to delete assigned user "${firstName + ' ' + lastName}" ?`,
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
          this.assetmateService.deleteAssignUsers(this.userCatAssignmentId).subscribe(res => {

            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.assetmateService.setBadgeUpdateAction('assetList', true);
            this.getAllAssignUsers(this.page);

          }, error => {
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }

  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/
  // editDocument(visit: number) {
  //   this.showFirst = !this.showFirst;
  //   this.dataService.saveData(visit);
  // }



  // viewAsset = (assetId: number) => {
  //   this.dataService.changeData(assetId);
  //   this.router.navigate(['/asset/asset-details']);
  // }



}

export interface AssignUser {
  firstName: string;
  lastName: string;
  assignmentType: string;
}

