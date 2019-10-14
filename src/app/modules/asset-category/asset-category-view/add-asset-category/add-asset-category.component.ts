import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-asset-category',
  templateUrl: './add-asset-category.component.html',
  styleUrls: ['./add-asset-category.component.css']
})
export class AddAssetCategoryComponent implements OnInit {

  // assetData:any ={}

  constructor(private router:Router) { }

  ngOnInit() {
  }

 

  // backToList(){
  //   this.router.navigate(['/asset-category']);
  // }

  // addAsset(){}

}
