import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ComplaintsService } from '../../service/complaints.service';
import { DialogService } from '../../../../public service/dialog.service';
import { MatSnackBar, MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { SpinnerService } from '../../../../public service/spinner.service';
import { Subscription } from 'rxjs';
import { AddComplaintsComponent } from '../add-complaints/add-complaints.component';
import { AppDialogData } from '../../../../model/appDialogData';
import { AppImgDialogComponent } from 'src/app/shared/app-img-dialog/app-img-dialog.component';

@Component({
  selector: 'app-view-complaints',
  templateUrl: './view-complaints.component.html',
  styleUrls: ['./view-complaints.component.css']
})

export class ViewComplaintsComponent implements AfterViewInit, OnDestroy {

  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  manufacturerData: any = {};
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  Router: any;
  nonzero: boolean = false;
  isNoRecordFound: boolean = true;
  totalComplaints: any;
  complaintId: number;

  displayedColumns: string[] = ['complaintImage', 'typeOfComplaint', 'title', 'assetTitle', 'assetCode', 'complaintStatus', 'typeOfUser', 'raisedByName', 'createdOn', 'Actions'];
  paidDataSource: MatTableDataSource<Complaint> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;

  dialogServiceSubscription: Subscription;

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private complaintsService: ComplaintsService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getAllComplaints(this.pageNumber);
  }


  /*********************************************************** Add New Complaint *******************************************************************/

  addComplaint() {
    const dialogRef = this.dialog.open(AddComplaintsComponent, {
      data: { type: 'Add' },
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllComplaints(this.pageNumber);
      }
    });
  }

  /*********************************************************** Get all Complaints *******************************************************************/

  getAllComplaints(pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.complaintsService.getAllComplaints(pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.complaintList) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
          this.showSnackBar(res.message);
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.complaintList;
        this.totalComplaints = res.totalComplaints;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
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

  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getAllComplaints(this.page);
  }

  /*********************************************************** View Particular Complaint  *******************************************************************/

  viewComplaint(complaintId: number) {
    this.router.navigate(['complaints/details-complaints/' + complaintId]);
  }

  /*********************************************************** Delete Particular Complaint *******************************************************************/

  deleteComplaint(complaintId: number, title: string) {
    this.complaintId = complaintId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE COMPLAINT',
      message: ` Are your sure you want to delete complaint "${title}"`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel",
      action: 'complaint'
    }
    this.dialogService.setDialogVisibility(appDialogData);
    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogServiceSubscription = this.dialogService.getUserDialogAction().subscribe((resp: any) => {
        if (resp.result == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (resp.result == 1) {
          if (resp.action == 'complaint') {
            this.dialogService.setUserDialogAction(0);
            //User has approved delete operation
            this.spinnerService.setSpinnerVisibility(true);
            this.complaintsService.deleteComplaint(this.complaintId).subscribe(res => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar(res.message);
              this.getAllComplaints(this.page);
            }, error => {
              this.showSnackBar("Something went wrong..!!");
            });
          }
        }
      })
    }
  }

  /*********************************************************** Search Documate *******************************************************************/

  searchComplaint(keyword) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.spinnerService.setSpinnerVisibility(true);
      this.complaintsService.searchComplaint(keyword).subscribe(res => {
        this.spinnerService.setSpinnerVisibility(false);
        if (res && res.data) {
          this.paidDataSource = res.data;
          this.isNoRecordFound = false;
        } else {
          this.paidDataSource = new MatTableDataSource<any>([]);
          this.isNoRecordFound = true;
        }
      },
        error => {
          this.spinnerService.setSpinnerVisibility(false);
        })
    } else {
      if (this.nonzero == true) {
        this.nonzero = false;
        this.getAllComplaints(this.pageNumber);
      }
    }
  }

  ngOnDestroy() {
    this.dialogServiceSubscription.unsubscribe();
  }

  isCurrentUserSuperAdmin() {
    return JSON.parse(localStorage.getItem('currentUser')).data.role == 0;
  }

  /********************************************Preview Particular Complaint Image*************************************************/

  priviewImage(title, imageUrl) {
    this.dialog.open(AppImgDialogComponent, {
      data: { imageType: 'Complaint', imageTitle: title, imageUrl: imageUrl, },
      width: '90vw',
      height: '80vh',
      panelClass: 'app-img-dialog',
      backdropClass: 'app-img-dialog-backdrop'
    });
  }

  getComplaintImagePath(imageUrl) {
    if (imageUrl != null && imageUrl.length > 0) {
      return imageUrl;
    }
    return 'assets/img/defaultImage.png';
  }

}

export interface Complaint {
  complaintId: number,
  title: string,
  typeOfComplaint: string,
  assetTitle: string,
  assetCode: number,
  complaintStatus: string,
  typeOfUser: string,
  raisedByName: string,
  complaintImage: string
}

