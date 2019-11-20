import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { DataSharingService } from '../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from '../../../public service/dialog.service';
import { SpinnerService } from '../../../public service/spinner.service';
import { AppDialogData } from '../../../model/appDialogData';

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
        this.paidDataSource = res.users;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }



  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllUsers(this.message.departmentId, this.page);
  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/

  editUser(visit) {
    this.dataService.changeData(visit);
    this.router.navigate(['/user/add-user']);
  }



  /*********************************************************** Delete Particular Asset *******************************************************************/

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



  addUser() {
    let selectedUser = null;
    this.dataService.changeData(selectedUser);
    this.router.navigate(['/user/add-user']);
  }



}


export interface User {
  userId: number,
  firstName: string,
  lastName: string,
  profileImage: string,
  userRoleIdFK: number,
  departmentTitle: string,
  mobileNumber: string,
  emailId: string,
  password: string
}
