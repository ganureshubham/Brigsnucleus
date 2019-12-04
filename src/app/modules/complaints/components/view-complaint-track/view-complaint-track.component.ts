import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../../../public service/spinner.service';
import { ComplaintsService } from '../../service/complaints.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-complaint-track',
  templateUrl: './view-complaint-track.component.html',
  styleUrls: ['./view-complaint-track.component.css']
})
export class ViewComplaintTrackComponent implements AfterViewInit, OnInit {


  isNoRecordFound: boolean = true;
  complaintID: any;
  pageNumber = 0;
  totalCount = 0;
  public page: number = 0;
  nonzero: boolean = false;




  displayedColumns: string[] = ['userProfile', 'typeOfComplaint', 'typeOfUser', 'userName', 'createdDate', 'complaintStatus',];
  dataSource: MatTableDataSource<ComplaintTrack> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;





  constructor(
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private complaintsService: ComplaintsService,
    private route: ActivatedRoute
  ) { }


  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.complaintID = this.route.snapshot.params['complaintId'];
    this.getAllComplaintsTrack(this.complaintID, this.pageNumber);
  }

  /***********************************************************Get All Complaint Track List *******************************************************************/

  getAllComplaintsTrack(complaintId: number, pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.complaintsService.getAllComplaintsTrack(complaintId, pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.complaintTrackList) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = res.complaintTrackList;
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
    this.getAllComplaintsTrack(this.complaintID, this.page);
  }

  /*********************************************************** Search Complaint Track  *******************************************************************/
  searchComplaintTrack(keyword) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.complaintsService.searchComplaintTrack(this.complaintID, keyword).subscribe(res => {
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
        this.getAllComplaintsTrack(this.complaintID, this.pageNumber);
      }
    }
  }






}

export interface ComplaintTrack {
  userProfile: string,
  typeOfComplaint: string,
  typeOfUser: string,
  userName: string,
  createdDate: string,
  complaintStatus: string
}
