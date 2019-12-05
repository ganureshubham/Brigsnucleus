import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../../../public service/spinner.service';
import { TaskmateService } from '../../service/taskmate.service';
import { ActivatedRoute } from '@angular/router';
import { AddTaskmateTransferComponent } from '../add-taskmate-transfer/add-taskmate-transfer.component';

@Component({
  selector: 'app-view-taskmate-transfer',
  templateUrl: './view-taskmate-transfer.component.html',
  styleUrls: ['./view-taskmate-transfer.component.css']
})
export class ViewTaskmateTransferComponent implements AfterViewInit, OnInit {


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
    private taskmateService: TaskmateService,
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
    this.getAllTaskTransferList(this.complaintID, this.pageNumber);
  }

  /***********************************************************Get All Task Transfer List *******************************************************************/


  getAllTaskTransferList(complaintId: number, pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.taskmateService.getAllTaskTransferList(complaintId, pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.transferTaskList) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = res.transferTaskList;
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
    this.getAllTaskTransferList(this.complaintID, this.page);
  }

  /*********************************************************** Search Task Transfer  *******************************************************************/

  searchTaskTransferlist(keyword) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.spinnerService.setSpinnerVisibility(true);
      this.taskmateService.searchTaskTransferlist(this.complaintID, keyword).subscribe(res => {
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
        this.getAllTaskTransferList(this.complaintID, this.pageNumber);
      }
    }
  }

  /*********************************************************** Add New Task Transfer  *******************************************************************/

  addTransferTask() {
    const dialogRef = this.dialog.open(AddTaskmateTransferComponent, {
      data: { type: 'Add', complaintid: this.complaintID },
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllTaskTransferList(this.complaintID, this.pageNumber);
      }
    });
  }


  isCurrentUserSuperAdmin() {
    return JSON.parse(localStorage.getItem('currentUser')).data.role == 0;
  }



}

export interface ComplaintTrack {
  complaintId: number,
  complaintTitle: string,
  fromUser: string,
  toUser: string,
  transferStatus: string,
  createdDate: string,

}
