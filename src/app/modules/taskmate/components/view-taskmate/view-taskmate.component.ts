import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskmateService } from '../../service/taskmate.service';
import { DialogService } from '../../../../public service/dialog.service';
import { SpinnerService } from '../../../../public service/spinner.service';
import { AddTaskmateComponent } from '../add-taskmate/add-taskmate.component';
import { AppDialogData } from '../../../../model/appDialogData';

@Component({
  selector: 'app-view-taskmate',
  templateUrl: './view-taskmate.component.html',
  styleUrls: ['./view-taskmate.component.css']
})
export class ViewTaskmateComponent implements AfterViewInit, OnDestroy {


  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  manufacturerData: any = {};
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  Router: any;
  nonzero: boolean = false;
  isNoRecordFound: boolean = true;
  totalTasks: any;
  complaintId: number;


  displayedColumns: string[] = ['typeOfComplaint', 'title', 'complaintStatus', 'typeOfUser', 'raisedByName', 'createdDate', 'Actions'];
  paidDataSource: MatTableDataSource<Complaint> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;




  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private taskmateService: TaskmateService,
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
    this.getAllTaskmate(this.pageNumber);
  }


  /*********************************************************** Add New Taskmate *******************************************************************/

  addTaskmate() {
    const dialogRef = this.dialog.open(AddTaskmateComponent, {
      data: { type: 'Add' },
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllTaskmate(this.pageNumber);
      }
    });

  }



  /*********************************************************** Get all Taskmate *******************************************************************/

  getAllTaskmate(pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.taskmateService.getAllTaskmate(pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.tasksList) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.tasksList;
        this.totalTasks = res.totalTasks;
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
    this.getAllTaskmate(this.page);
  }

  /*********************************************************** View Particular Taskmate  *******************************************************************/



  viewTaskmate(complaintId: number) {
    this.router.navigate(['taskmate/details-taskmate/' + complaintId]);
  }




  /*********************************************************** Delete Particular Taskmate *******************************************************************/


  deleteTaskmate(complaintId: number, title: string) {
    this.complaintId = complaintId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE TASKMATE',
      message: ` Are your sure you want to delete taskmate "${title}"`,
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
          this.taskmateService.deleteTaskmate(this.complaintId).subscribe(res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.getAllTaskmate(this.page);
          }, error => {
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }
  }




  /*********************************************************** Search Taskmate *******************************************************************/

  searchTaskmate(keyword) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.spinnerService.setSpinnerVisibility(true);
      this.taskmateService.searchTaskmate(keyword).subscribe(res => {
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
        this.getAllTaskmate(this.pageNumber);
      }
    }
  }

  isCurrentUserSuperAdmin() {
    return JSON.parse(localStorage.getItem('currentUser')).data.role == 0;
  }




  ngOnDestroy(): void { }




}


export interface Complaint {
  complaintId: number,
  title: string,
  typeOfComplaint: string,
  complaintStatus: string,
  typeOfUser: string,
  raisedByName: string,
  createdDate: string
}

