import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from '../../../public service/data-sharing.service';
import { UserService } from '../service/user.service';
import { DialogService } from '../../../public service/dialog.service';
import { SpinnerService } from '../../../public service/spinner.service';
import { AppDialogData } from '../../../model/appDialogData';
import { AddUserComponent } from './add-user/add-user.component';
import { AppImgDialogComponent } from '../../../shared/app-img-dialog/app-img-dialog.component';

interface userDialogData {
  type: string;
  userId: number;
  firstName: string;
  lastName: string;
  profileImage: string;
  userRoleIdFK: number;
  departmentTitle: string;
  departmentIdFK: number;
  mobileNumber: number;
  emailId: string;
  password: string;
}

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  userData: any = {};
  departmentId: any;
  Router: any;
  deptId: any;
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  isNoRecordFound: boolean = false;
  nonzero: boolean = false;
  dialogData: userDialogData;

  displayedColumns: string[] = ['userName', 'profileImage', 'userRole', 'mobileNumber', 'emailId', 'activateuser', 'Actions'];
  paidDataSource: MatTableDataSource<User> = new MatTableDataSource();

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator; 
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  message: any = {};
  DepartmentObj: string = '';
  userId: number;
  dialogServiceSubscription: Subscription = null;

  constructor(private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    public dataService: DataSharingService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    public dialog: MatDialog

  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    //this.deptId = this.route.snapshot.params['departmentId'];
    if (this.message && this.message.departmentId) {
      this.DepartmentObj = '(' + this.message.name + ')';
      this.getAllUsers(this.message.departmentId, this.pageNumber);
    } else {
      this.isNoRecordFound = true;
    }
  }

  receiveMessage($event) {
    this.message = $event;
    if (this.message) {
      if (this.message.name) {
        this.DepartmentObj = '(' + this.message.name + ')';
      } else if (this.message.departmentTitle) {
        this.DepartmentObj = '(' + this.message.departmentTitle + ')';
      }
      this.getAllUsers(this.message.departmentId, this.pageNumber);
    }
  }

  ngOnDestroy() {
    if (this.dialogServiceSubscription) {
      this.dialogServiceSubscription.unsubscribe();
    }
  }

  /*********************************************************** Get All Users *******************************************************************/

  getAllUsers(departmentId: number, pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.userService.getAllUsers(departmentId, pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
          this.showSnackBar(res.message, 2000);
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.users;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message, 2000);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!", 2000);
      })
  }

  showSnackBar(message: string, duration: any) {
    this.snackBar.open(message, '', { duration: duration });
  }

  /***********************************************************Search Users *******************************************************************/

  searchUser(keyword) {
    if (keyword.length > 0) {
      this.nonzero = true;
      this.spinnerService.setSpinnerVisibility(true);
      this.userService.searchUser(this.message.departmentId, keyword).subscribe(res => {
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
        this.getAllUsers(this.message.departmentId, this.pageNumber);
      }
    }
  }

  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllUsers(this.message.departmentId, this.page);
  }

  /*********************************************************** Preview Particular User Image  *******************************************************************/

  priviewImage(title, imageUrl) {
    this.dialog.open(AppImgDialogComponent, {
      data: { imageType: 'User', imageTitle: title, imageUrl: imageUrl, },
      width: '90vw',
      height: '80vh',
      panelClass: 'app-img-dialog',
      backdropClass: 'app-img-dialog-backdrop'
    });
  }

  /*********************************************************** Edit Particular User  *******************************************************************/

  editUser(visit) {
    this.dialogData = {
      type: 'Edit',
      departmentIdFK: visit.departmentIdFK,
      userId: visit.userId,
      firstName: visit.firstName,
      lastName: visit.lastName,
      profileImage: visit.profileImage,
      userRoleIdFK: visit.userRoleIdFK,
      departmentTitle: visit.departmentTitle,
      mobileNumber: visit.mobileNumber,
      emailId: visit.emailId,
      password: visit.password,
    }
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: this.dialogData,
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllUsers(this.message.departmentId, this.pageNumber);
      }
    })
  }

  /*********************************************************** Delete Particular User *******************************************************************/

  deleteUser(userId: number, firstName: string, lastName: string) {
    this.userId = userId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE USER',
      message: ` Are your sure you want to delete user "${firstName} ${lastName}"`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel",
      action: 'user'
    }
    this.dialogService.setDialogVisibility(appDialogData);
    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogServiceSubscription = this.dialogService.getUserDialogAction().subscribe((resp: any) => {
        if (resp.result == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (resp.result == 1) {
          if (resp.action == 'user') {
            this.dialogService.setUserDialogAction(0);
            //User has approved delete operation
            this.spinnerService.setSpinnerVisibility(true);
            this.userService.deleteUser(this.userId).subscribe(res => {
              this.spinnerService.setSpinnerVisibility(false);
              if (res.status) {
                this.showSnackBar(res.message, 4000);
                this.getAllUsers(this.message.departmentId, this.page);
              } else {
                this.showSnackBar(res.message, 4000);
              }
            }, error => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar("Something went wrong..!!", 2000);
            });
          }
        }
      })
    }
  }

  /*********************************************************** Add User *******************************************************************/

  addUser() {
    this.dialogData = {
      type: 'Add',
      departmentIdFK: 0,
      userId: 0,
      firstName: '',
      lastName: '',
      profileImage: '',
      userRoleIdFK: 0,
      departmentTitle: '',
      mobileNumber: 0,
      emailId: '',
      password: '',
    }

    const dialogRef = this.dialog.open(AddUserComponent, {
      data: this.dialogData,
      width: '500px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllUsers(this.message.departmentId, this.pageNumber);
      }
    })
  }

  /*********************************************************** Activate/Deactivate User *******************************************************************/

  activateUser(userId: number, value: any, index: any) {
    this.paidDataSource[index].isActive = value.checked;
    let body = {
      isActive: value.checked ? 1 : 0
    }
    this.spinnerService.setSpinnerVisibility(true);
    this.userService.activateUser(userId, body).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        this.paidDataSource[index].isActive = value.checked;
      } else {
        this.spinnerService.setSpinnerVisibility(false);
        this.paidDataSource[index].isActive = !value.checked;
      }
      this.showSnackBar(res.message, 2000);
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!", 2000);
        this.paidDataSource[index].isActive = !value.checked;
      })
  }

}

export interface User {
  userId: number,
  firstName: string,
  isActive: string,
  lastName: string,
  profileImage: string,
  userRoleIdFK: number,
  departmentTitle: string,
  userRole: string,
  departmentIdFK: number,
  mobileNumber: number,
  emailId: string,
  password: string
}
