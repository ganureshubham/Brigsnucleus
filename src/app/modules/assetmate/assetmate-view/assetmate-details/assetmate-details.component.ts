import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { AssetmateService } from '../../service/assetmate.service';



@Component({
  selector: 'app-assetmate-details',
  templateUrl: './assetmate-details.component.html',
  styleUrls: ['./assetmate-details.component.css'],
})
export class AssetmateDetailsComponent implements OnInit {


  categoryID: any;
  category: any;


  constructor(
    private assetmateService: AssetmateService,
    private router: Router,
    public dataService: DataSharingService, 
  ) {
    
  }

  ngOnInit() {
    this.getdata();
  }


  getdata() {
    let categorydata = localStorage.getItem('Category-Object');
    console.log(categorydata);
    this.category = JSON.parse(categorydata);
  }

  backToList() {
    this.router.navigate(['/assetmate']);
  }

  goto() {
    this.router.navigate(['/assetmate/asset-add']);
  }



}


