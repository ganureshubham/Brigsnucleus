import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../../../public service/spinner.service';
import { ComplaintsService } from '../../service/complaints.service';
import { ActivatedRoute } from '@angular/router';
import { AddTransferComplaintComponent } from '../add-transfer-complaint/add-transfer-complaint.component';

@Component({
  selector: 'app-view-transfer-complaint',
  templateUrl: './view-transfer-complaint.component.html',
  styleUrls: ['./view-transfer-complaint.component.css']
})
export class ViewTransferComplaintComponent implements AfterViewInit, OnInit {


  isNoRecordFound: boolean = true;
  complaintID: any;
  pageNumber = 0;
  totalCount = 0;
  public page: number = 0;
  nonzero: boolean = false;




  displayedColumns: string[] = ['complaintTitle', 'fromUser', 'toUser', 'transferStatus', 'createdDate',];
  dataSource: MatTableDataSource<ComplaintTrack> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;





  constructor(
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private complaintsService: ComplaintsService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }


  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.complaintID = this.route.snapshot.params['complaintId'];
    this.getAllTransferComplaints(this.complaintID, this.pageNumber);
  }

  /***********************************************************Get All Complaint Transfer List *******************************************************************/


  getAllTransferComplaints(complaintId: number, pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.complaintsService.getAllTransferComplaints(complaintId, pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.transferComplaintList) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = res.transferComplaintList;
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
    this.getAllTransferComplaints(this.complaintID, this.page);
  }

  /*********************************************************** Search Complaint Transfer  *******************************************************************/

  searchTransferComplaint(keyword) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.complaintsService.searchComplaintTransfer(this.complaintID, keyword).subscribe(res => {
        if (res && res.data) {
          this.dataSource = res.data;
        }
      },
        error => {
          console.log(error.errors.msg);
        })
    } else {
      if (this.nonzero == true) {
        this.nonzero = false;
        this.getAllTransferComplaints(this.complaintID, this.pageNumber);
      }
    }
  }

  /*********************************************************** Add New Complaint Transfer  *******************************************************************/

  addTransferComplaint() {
    const dialogRef = this.dialog.open(AddTransferComplaintComponent, {
      data: { type: 'Add', complaintid: this.complaintID },
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllTransferComplaints(this.complaintID, this.pageNumber);
      }
    });


  }












}

export interface ComplaintTrack {
  transferComplaintId: number,
  complaintTitle: string,
  fromUser: string,
  toUser: string,
  transferStatus: string,
  createdDate: string,

}
