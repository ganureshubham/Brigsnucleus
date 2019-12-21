import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AssetmateService } from '../../../service/assetmate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from '../../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '../../../../../public service/spinner.service';
import { MatSnackBar, MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { DialogService } from '../../../../../public service/dialog.service';
import { AppDialogData } from 'src/app/model/appDialogData';
import { ChecklistAddComponent } from './checklist-add/checklist-add.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-checklist',
  templateUrl: './view-checklist.component.html',
  styleUrls: ['./view-checklist.component.css']
})
export class ViewChecklistComponent implements AfterViewInit, OnInit {
  pageNumber = 0;
  totalCount = 0;
  checklistData: any = [];
  showFirst: boolean = false;
  categoryId: any;
  public page: number = 0;
  categoryID: any;
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  deleteChecklistWithId;
  isNoRecordFound: boolean = true;
  nonzero: boolean = false;





  displayedColumns: string[] = ['title', 'duration', 'totalQuestions', 'Actions'];
  dataSource: MatTableDataSource<checklist> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;

  constructor(
    private assetmateService: AssetmateService,
    private router: Router,
    private route: ActivatedRoute,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.categoryID = this.route.snapshot.params['categoryId'];
    this.getAllChecklists(this.categoryID, this.pageNumber);
  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.dataSource.paginator = this.paginator;
  }


  /*********************************************************** Get All Checklists *******************************************************************/

  getAllChecklists(categoryId: number, pageNo: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getAllChecklists(categoryId, pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.ChecklistData) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = res.ChecklistData;
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
    this.page = pageNo.pageIndex;
    this.getAllChecklists(this.categoryID, this.page);
  }


  /*********************************************************** Add Checklist**********************************************************************************************/

  addChecklist() {
    const dialogRef = this.dialog.open(ChecklistAddComponent, {
      data: { categoryid: this.categoryID, type: 'Add', },
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllChecklists(this.categoryID, this.pageNumber);
      }
    });
  }


  /*********************************************************** Edit Checklist**********************************************************************************************/

  editChecklist(visit: any) {
    const dialogRef = this.dialog.open(ChecklistAddComponent, {
      data: { categoryid: this.categoryID, type: 'Edit', checklistdata: visit },
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllChecklists(this.categoryID, this.pageNumber);
      }
    });
  }



  navigateToChecklistQuestionView(checklistId: number) {
    this.router.navigate(['/assetmate/assetmate-details/' + this.categoryID + '/checklist/' + checklistId]);
  }

  /*********************************************************** Delete Particular Checklist *******************************************************************/
  deleteChecklist(checklistId: number, checklistTitle: string) {
    this.deleteChecklistWithId = checklistId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE AUDIT',
      message: `Are your sure you want to delete audit "${checklistTitle}" ?`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel",
      action: "checklist"
    }

    this.dialogService.setDialogVisibility(appDialogData);
    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogService.getUserDialogAction().subscribe((resp: any) => {
        if (resp.result == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (resp.result == 1) {
          if (resp.action == "checklist") {
            this.dialogService.setUserDialogAction(0);
            //User has approved delete operation 
            this.spinnerService.setSpinnerVisibility(true);
            this.assetmateService.deleteChecklist(this.deleteChecklistWithId).subscribe(res => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar(res.message);
              this.assetmateService.setBadgeUpdateAction('assetList', true);
              this.getAllChecklists(this.categoryID, this.page);
            }, error => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar("Something went wrong..!!");
            });
          }

        }
      })
    }
  }


  /*********************************************************** Search Particular Checklist ************************************************************/


  searchChecklist(keyword: any) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.assetmateService.searchChecklist(this.categoryID, keyword).subscribe((res: any) => {
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
        this.getAllChecklists(this.categoryID, this.pageNumber);
      }
    }
  }

}

export interface checklist {
  checklistId: number,
  title: string,
  checkingDuration: number,
  durationTypeIdFK: number,
  durationType: string,
  totalQuestions: number

}
