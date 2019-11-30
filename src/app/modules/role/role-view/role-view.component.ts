import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RoleService } from '../service/role.service';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { SpinnerService } from '../../../public service/spinner.service';
import { AppDialogData } from '../../../model/appDialogData';
import { DialogService } from '../../../public service/dialog.service';
import { AddRoleComponent } from './add-role/add-role.component';


interface roleDialogData {
  userRoleId: number;
  title: string;
  type: string;
}

@Component({
  selector: 'app-role-view',
  templateUrl: './role-view.component.html',
  styleUrls: ['./role-view.component.css']
})
export class RoleViewComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  roleData: any = {};
  userRoleId: number;
  isNoRecordFound: boolean = true;
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  dialogData: roleDialogData;




  displayedColumns: string[] = ['title', 'Actions'];
  paidDataSource: MatTableDataSource<Role> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;

  constructor(private http: HttpClient,
    private router: Router,
    private roleService: RoleService,
    public dataService: DataSharingService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    public dialog: MatDialog,
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getAllRoles(this.pageNumber);
  }


  ngOnDestroy(): void { }


  /*********************************************************** Get All Roles *******************************************************************/



  getAllRoles(pageNo: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.roleService.getAllRoles(pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.userroles) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.userroles;
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
    )
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }


  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllRoles(this.page);
  }

  /*********************************************************** Add Role *******************************************************************/

  addRole(): void {
    this.dialogData = {
      type: 'Add',
      userRoleId: 0,
      title: '',
    }
    const dialogRef = this.dialog.open(AddRoleComponent, {
      data: this.dialogData,
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllRoles(this.pageNumber);
      }
    });
  }

  /*********************************************************** Delete Particular Role *******************************************************************/

  deleteRole(userRoleId: number, title: string) {
    this.userRoleId = userRoleId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE USER ROLE',
      message: ` Are your sure you want to delete User Role "${title}"`,
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
          this.roleService.deleteRole(this.userRoleId).subscribe(res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.getAllRoles(this.page);
          }, error => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }
  }



  /*********************************************************** Edit Particular Asset  *******************************************************************/

  editRole(visit: any) {
    this.dialogData = {
      type: 'Edit',
      userRoleId: visit.userRoleId,
      title: visit.title
    }
    const dialogRef = this.dialog.open(AddRoleComponent, {
      data: this.dialogData,
      width: '450px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllRoles(this.pageNumber);
      }
    })
  }



}

export interface Role {
  userRoleId: number;
  title: string;
}
