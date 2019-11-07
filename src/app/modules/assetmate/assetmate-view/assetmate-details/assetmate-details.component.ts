import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { AssetmateService } from '../../service/assetmate.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-assetmate-details',
  templateUrl: './assetmate-details.component.html',
  styleUrls: ['./assetmate-details.component.css'],
})
export class AssetmateDetailsComponent implements OnInit {

  categoryID: any;
  category: any = [{}];

  constructor(
    private route: ActivatedRoute,
    private assetmateService: AssetmateService,
    private router: Router,
    public dataService: DataSharingService, 
    private _location: Location
  ) {
    
  }

  ngOnInit() {
  
    console.log( this.route.snapshot.params['categoryId'] + 'Category Id')
        //   this.activatedRoute.queryParams.subscribe(params => {
        //     console.log(params['categoryId']+"Category ID");
        // });
    this.getdata();
  }


  getdata() {
    // let categorydata = localStorage.getItem('Category-Object');
    // console.log(categorydata);
    // this.category = JSON.parse(categorydata);
     
    console.log('getdata');
    this.assetmateService.getAllRootCateg().subscribe(res => { 
      console.log('Complete Data');
      if (res) {
        console.log('Complete Data');
        console.log(res.rootCategory);
        for(let i=0; i<(res.rootCategory).length; i++){
          if(res.rootCategory[i].categoryId == this.route.snapshot.params['categoryId']){
            this.category = res.rootCategory[i];
            console.log('This category:');
            console.log(this.categoryID);
            break;
          }
        }
        console.log(this.category);
      }
    },
      error => {
        console.log(error.error.message);
      })

  }

  backToList() {
    this.router.navigate(['/assetmate']);
  }

  goto() {
    this.router.navigate(['/assetmate/asset-add']);
  }



}


