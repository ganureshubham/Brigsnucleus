import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router'; 
import { AssetCategoryService } from '../service/asset-category.service';

@Component({
  selector: 'app-asset-category-view',
  templateUrl: './asset-category-view.component.html',
  styleUrls: ['./asset-category-view.component.css']
})
export class AssetCategoryViewComponent implements AfterViewInit, OnDestroy {

  // loading : boolean;

  // displayedColumns: string[] = ['departmentId', 'departmentTitle','Actions'];
  // paidDataSource: MatTableDataSource<Dept> = new MatTableDataSource();

  // @ViewChild('paidPaginator') paidPaginator: MatPaginator;

  // previousSubscription: Subscription;
  // upcomingSubscription: Subscription;
  // Router: any;

  constructor(private http: HttpClient ,private assetcatService:AssetCategoryService, private router:Router) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    // this.paidDataSource.paginator = this.paidPaginator;
    // this.getAllDepartments();
  }

   ngOnDestroy(): void {}

  // getAllDepartments(){
  //   this.loading = true;
  //   this.assetcatService.getAllDepartments(1).subscribe(res =>{
  //     this.paidDataSource.data = res.department; 
  //   },
  //   error => {
  //     this.loading = false;
  //    console.log(error); 
  //   }
  //   );
  // }

  // addAsset(){
  //   this.router.navigate(['/asset-category/add-asset-category'])
  // }
  // deleteDept() {}

  // editDept(){
    
  // }
 

}

// export interface Dept {
//   departmentId: number;
//   departmentTitle: string;
// }
