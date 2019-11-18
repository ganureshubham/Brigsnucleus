import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RoleService } from '../service/role.service';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { SpinnerService } from '../../../public service/spinner.service';
import { AppDialogData } from '../../../model/appDialogData';
import { DialogService } from '../../../public service/dialog.service';

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

  isAlreadySubscribedToDialogUserActionService: boolean = false;

  displayedColumns: string[] = ['userRoleId', 'title', 'Actions'];
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
    private dialogService: DialogService
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
        this.paidDataSource = res.userroles;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;

      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
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

  addRole() {
    let selectedAsset = null;
    this.dataService.changeData(selectedAsset);
    this.router.navigate(['/user-role/add-user-role'])
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
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }

  }



  /*********************************************************** Edit Particular Asset  *******************************************************************/

  editRole(userRoleId: number) {
    this.dataService.changeData(userRoleId);
    this.router.navigate(['/user-role/add-user-role']);


  }


}

export interface Role {
  userRoleId: number;
  title: string;
}
