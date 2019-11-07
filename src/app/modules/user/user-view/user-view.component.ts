import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { DataSharingService } from '../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

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

  displayedColumns: string[] = ['userId', 'userName', 'profileImage', 'departmentTitle', 'mobileNumber', 'emailId', 'userRoleIdFK', 'Actions'];
  paidDataSource: MatTableDataSource<User> = new MatTableDataSource(); 

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;

  constructor(private http: HttpClient,
    private userService: UserService,
    private router: Router,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner:NgxSpinnerService  
    
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getAllUsers(this.pageNumber); 
  }

  ngOnDestroy(): void { }

  /*********************************************************** Get All Users *******************************************************************/

  getAllUsers(pageNo: any) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.userService.getAllUsers(pageNo).subscribe(res => { 
      console.log(res);
      this.paidDataSource=res.users;
      this.pageNumber=res.currentPage;
      this.totalCount=res.totalCount; 
    },
    error =>{
      this.toastr.error(error.error.message);
    })
  }



  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllUsers(this.page);
  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/

  editUser(userId: number) {
    this.dataService.changeData(userId);
    this.router.navigate(['/user/add-user']);
  }



  /*********************************************************** Delete Particular Asset *******************************************************************/
  deleteUser(userId: number) {
    alert('are you sure?');
    this.userService.deleteUser(userId).subscribe(res => {
      this.toastr.success(res.message);
      this.getAllUsers(this.page);
    })
    error => {
      console.log(error);
      this.toastr.error(error.message);
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
  userName: string,
  profileImage: string,
  userRoleIdFK:number,
  departmentTitle: string,
  mobileNumber: string,
  emailId: string,
  password: string
}
