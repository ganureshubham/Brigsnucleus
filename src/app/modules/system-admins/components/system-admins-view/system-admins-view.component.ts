import { Component, OnInit, ViewChild } from '@angular/core';
import { SystemadminsService } from '../../services/systemadmins.service';
import { SpinnerService } from 'src/app/public service/spinner.service';
import { MatTableDataSource, MatSnackBar, MatPaginator, MatDialog } from '@angular/material';
import { SystemAdminsAddEditComponent } from '../system-admins-add-edit/system-admins-add-edit.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppDialogData } from 'src/app/model/appDialogData';
import { DialogService } from '../../../../public service/dialog.service';

@Component({
  selector: 'app-system-admins-view',
  templateUrl: './system-admins-view.component.html',
  styleUrls: ['./system-admins-view.component.css']
})
export class SystemAdminsViewComponent implements OnInit {

  page: number = 0;
  pageNumber = 0;
  totalCount = 0;
  displayedColumns: string[] = ['AdminName', 'OrganizationName', 'MobileNumber', 'EmailId', 'Actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  isNoRecordFound: boolean = false;
  isSearchRequestAllowed: boolean = true;
  mobileQuery: MediaQueryList;
  deleteAdminId: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private systemadminsService: SystemadminsService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    media: MediaMatcher,
    private dialogService: DialogService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit() {
    this.getAllAdmins(this.pageNumber);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getAllAdmins(pageNo) {
    this.spinnerService.setSpinnerVisibility(true);
    this.systemadminsService.getAllAdmins(pageNo).subscribe((resp: any) => {
      this.spinnerService.setSpinnerVisibility(false);
      if (resp && resp.admin) {
        if (resp.currentPage == 0 && resp.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = resp.admin;
        this.pageNumber = resp.currentPage;
        this.totalCount = resp.totalCount;
      } else {
        this.showSnackBar(resp.message);
      }
    },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar('Something went wrong..!!')
      });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getAllAdmins(this.page);
  }

  searchAdmin(keyword) {
    if (keyword) {
      this.isSearchRequestAllowed = true;
      this.spinnerService.setSpinnerVisibility(true);
      this.systemadminsService.searchAdmin(keyword).subscribe(res => {
        this.spinnerService.setSpinnerVisibility(false);
        if (res && res.data) {
          this.dataSource = res.data;
          this.isNoRecordFound = false;
        } else {
          this.dataSource = new MatTableDataSource<object>([]);
          this.isNoRecordFound = true;
        }
      },
        error => {
          this.spinnerService.setSpinnerVisibility(false);
        })
    } else {
      if (this.isSearchRequestAllowed) {
        this.isNoRecordFound = false;
        this.isSearchRequestAllowed = false;
        this.getAllAdmins(this.pageNumber);
      }
    }
  }

  addNewAdmin() {
    const dialogRef = this.dialog.open(SystemAdminsAddEditComponent, {
      width: this.mobileQuery.matches ? '90vw' : '30vw',
      disableClose: true,
      data: { action: "add" }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
        this.getAllAdmins(this.pageNumber);
      }
    });
  }

  editOrganization(admin) {
    const dialogRef = this.dialog.open(SystemAdminsAddEditComponent, {
      width: this.mobileQuery.matches ? '90vw' : '30vw',
      disableClose: true,
      data: { action: "edit", admin: admin }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
        this.getAllAdmins(this.pageNumber);
      }
    });
  }

  deleteAdmin(admin) {

    this.deleteAdminId = admin.adminId;
    let deleteAdminName = admin.adminName;

    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE ADMIN',
      message: `Are your sure you want to delete admin "${deleteAdminName}" ?`,
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
          this.systemadminsService.deleteAdmin(this.deleteAdminId).subscribe(res => {

            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.getAllAdmins(this.page);

          }, error => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }

  }

}
