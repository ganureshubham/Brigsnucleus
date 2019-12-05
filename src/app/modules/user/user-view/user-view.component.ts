import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { DataSharingService } from '../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from '../../../public service/dialog.service';
import { SpinnerService } from '../../../public service/spinner.service';
import { AppDialogData } from '../../../model/appDialogData';
import { AddUserComponent } from './add-user/add-user.component';


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
  isNoRecordFound: boolean = true;
  nonzero: boolean = false;
  dialogData: userDialogData;



  displayedColumns: string[] = ['userName', 'profileImage', 'departmentTitle', 'mobileNumber', 'emailId', 'Actions'];
  paidDataSource: MatTableDataSource<User> = new MatTableDataSource();

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  message: any = {};
  DepartmentObj: string = '';
  userId: number;


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
    }
  }

  receiveMessage($event) {
    this.message = $event;
    if (this.message.departmentTitle) {
      this.DepartmentObj = '(' + this.message.departmentTitle + ')';
    }
    if (this.message.name) {
      this.DepartmentObj = '(' + this.message.name + ')';
    }
    this.getAllUsers(this.message.departmentId, this.pageNumber);
  }



  isNoRecord() {
    return this.totalCount == 0;
  }

  ngOnDestroy(): void { }

  /*********************************************************** Get All Users *******************************************************************/

  getAllUsers(departmentId: number, pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.userService.getAllUsers(departmentId, pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.users) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.users;
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

  /*********************************************************** Edit Particular User  *******************************************************************/

  // editUser(visit) {
  //   this.dataService.changeData(visit);
  //   this.router.navigate(['/user/add-user']);
  // }

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
          this.userService.deleteUser(userId).subscribe(res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.getAllUsers(this.message.departmentId, this.page);
          }, error => {
            this.showSnackBar("Something went wrong..!!");
          });
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

}


export interface User {
  userId: number,
  firstName: string,
  lastName: string,
  profileImage: string,
  userRoleIdFK: number,
  departmentTitle: string,
  departmentIdFK: number,
  mobileNumber: number,
  emailId: string,
  password: string
}
