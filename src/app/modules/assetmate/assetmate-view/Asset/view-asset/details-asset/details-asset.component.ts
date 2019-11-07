import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute,
     private assetmateService:AssetmateService ,
      private dataService: DataSharingService) { } 






  ngOnInit() {
    console.log(this.route.snapshot.params['categoryId']+" - "+this.route.snapshot.params['assetId']+ ' CatId and AssetId');
    // this.dataService.mSaveData.subscribe(res => {
    //   if (res != null && res != "null" && res != "null") { 
        this.viewAsset(1);
      // }
    // })
    
  }

  viewAsset(assetId: number) {

    console.log('Asset Id '+this.route.snapshot.params['assetId']);

    this.assetmateService.viewAsset(this.route.snapshot.params['assetId']).subscribe(res => {
      this.assetData = res.asset;
      this.assetcode=res.asset.assetCode;
      this.userGuideBook = res.asset.userGuideBook.split('/').pop().split('?')[0];  
    },
    error=>{
      console.log(error);
    })
  }

  backToList() {
    // let categorydata = localStorage.getItem('Category-Object');
    // this.category = JSON.parse(categorydata);
    // this.dataService.changeData(this.category);
    // this.showFirst = !this.showFirst;
    this.router.navigate(['/assetmate/assetmate-details/'+this.route.snapshot.params['categoryId']]);  
  }


  listAsset() {
    this.router.navigate(['/assetmate/assetmate-details/'+this.route.snapshot.params['categoryId']]);  
  }

  

}
