import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetmateService } from '../../../../service/assetmate.service';
import { DataSharingService } from '../../../../../../public service/data-sharing.service';

@Component({
  selector: 'app-details-asset',
  templateUrl: './details-asset.component.html',
  styleUrls: ['./details-asset.component.css']
})
export class DetailsAssetComponent implements OnInit {
  assetData: any = {};
  userGuideBook: any;
  showFirst: boolean = false;
  category: any;
  assetcode: any;



  constructor(private router: Router,
     private assetmateService:AssetmateService ,
      private dataService: DataSharingService) { } 






  ngOnInit() {
    this.dataService.mSaveData.subscribe(res => {
      if (res != null && res != "null" && res != "null") { 
        this.viewAsset(res);
      }
    })
    
  }

  viewAsset(assetId: number) {
    this.assetmateService.viewAsset(assetId).subscribe(res => {
      this.assetData = res.asset;
      this.assetcode=res.asset.assetCode;
      this.userGuideBook = res.asset.userGuideBook.split('/').pop().split('?')[0];  
    },
    error=>{
      console.log(error);
    })
  }

  backToList() {
    let categorydata = localStorage.getItem('Category-Object');
    this.category = JSON.parse(categorydata);
    this.dataService.changeData(this.category);
    // this.showFirst = !this.showFirst;
    this.router.navigate(['/assetmate/assetmate-details']);  
  }


  listAsset() {
     this.router.navigate(['assetmate/assetmate-details']);
  }

  

}
