import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../service/assetmate.service';
import { DataSharingService } from '../../../public service/data-sharing.service';

@Component({
  selector: 'app-assetmate-view',
  templateUrl: './assetmate-view.component.html',
  styleUrls: ['./assetmate-view.component.css']
})
export class AssetmateViewComponent implements OnInit {
  category: any = [];
  mSearchCategory: any = [];

  constructor(private assetmateService: AssetmateService,
    private router: Router,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getRootCategoryList();
  }

  getRootCategoryList() {
    this.assetmateService.getAllRootCateg().subscribe(res => { 
      console.log(res);
      
      this.category = res.rootCategory;  
    })
  }

  categoryDetail(categoryId: any) {
    // let categoryObj=categ;
    // localStorage.setItem('Category-Object',JSON.stringify(categoryObj));
    // this.dataService.changeData(categ);
    this.router.navigate(['/assetmate/assetmate-details/'+categoryId]);
  }


  /*********************************************************** Search Category *******************************************************************/

  searchCategory(keyword) { 
    if (keyword) {
      this.assetmateService.searchCategory(keyword).subscribe(res => { 
        if (res && res.data) {
          this.category = res.data; 
        }
      },
        error => {
          console.log(error.error.message);
          this.toastr.error(error.error.message);
        })
    } else {
      this.getRootCategoryList(); 
    }
  }





}
