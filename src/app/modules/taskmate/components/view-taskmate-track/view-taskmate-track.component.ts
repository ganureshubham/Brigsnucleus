import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { TaskmateService } from '../../service/taskmate.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppImgDialogComponent } from '../../../../shared/app-img-dialog/app-img-dialog.component';

@Component({
  selector: 'app-view-taskmate-track',
  templateUrl: './view-taskmate-track.component.html',
  styleUrls: ['./view-taskmate-track.component.css']
})
export class ViewTaskmateTrackComponent implements AfterViewInit, OnInit {


  isNoRecordFound: boolean = true;
  complaintID: any;
  pageNumber = 0;
  totalCount = 0;
  public page: number = 0;
  nonzero: boolean = false;




  displayedColumns: string[] = ['userProfile', 'typeOfComplaint', 'typeOfUser', 'userName', 'createdDate', 'complaintStatus',];
  dataSource: MatTableDataSource<TaskmateTrack> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;





  constructor(
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private taskmateService: TaskmateService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }


  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.complaintID = this.route.snapshot.params['complaintId'];
    this.getAllTaskTracklist(this.complaintID, this.pageNumber);
  }

  /***********************************************************Get All Complaint Track List *******************************************************************/

  getAllTaskTracklist(complaintId: number, pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.taskmateService.getAllTaskTracklist(complaintId, pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.taskTrackList) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = res.taskTrackList;
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

  /*********************************************************** Preview Particular Task track Image  *******************************************************************/

  priviewImage(title, imageUrl) {
    this.dialog.open(AppImgDialogComponent, {
      data: { imageType: 'User', imageTitle: title, imageUrl: imageUrl, },
      width: '90vw',
      height: '80vh',
      panelClass: 'app-img-dialog',
      backdropClass: 'app-img-dialog-backdrop'
    });
  }

  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getAllTaskTracklist(this.complaintID, this.page);
  }

  /*********************************************************** Search Complaint Track  *******************************************************************/
  searchTaskTracklist(keyword) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.spinnerService.setSpinnerVisibility(true);
      this.taskmateService.searchTaskTracklist(this.complaintID, keyword).subscribe(res => {
        this.spinnerService.setSpinnerVisibility(false);
        if (res && res.data) {
          this.dataSource = res.data;
          this.isNoRecordFound = false;
        } else {
          this.dataSource = new MatTableDataSource<any>([]);
          this.isNoRecordFound = true;
        }
      },
        error => {
          this.spinnerService.setSpinnerVisibility(false);
        })
    } else {
      if (this.nonzero == true) {
        this.nonzero = false;
        this.getAllTaskTracklist(this.complaintID, this.pageNumber);
      }
    }
  }






}

export interface TaskmateTrack {
  userProfile: string,
  typeOfComplaint: string,
  typeOfUser: string,
  userName: string,
  createdDate: string,
  complaintStatus: string
}

