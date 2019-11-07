import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RoleService } from '../service/role.service';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
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
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.roleService.getAllRoles(pageNo).subscribe(res => { 
      console.log(res);
      this.paidDataSource = res.userroles;
      this.pageNumber = res.currentPage;
      this.totalCount = res.totalCount;


    },
      error => {

        this.toastr.error(error.message);
        console.log(error);

      }
    )
  }


  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllRoles(this.page); 
  }


  addRole() {
    let selectedAsset = null;
    this.dataService.changeData(selectedAsset);
    this.router.navigate(['/user-role/add-user-role'])
  }

  /*********************************************************** Delete Particular Role *******************************************************************/

  deleteRole(userRoleId: number) {
    alert('are you sure?');
    this.roleService.deleteRole(userRoleId).subscribe(res => {
      this.toastr.success(res.message);
      this.getAllRoles(this.page);
    })
    error => {
      console.log(error);
      this.toastr.error(error.message);

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
