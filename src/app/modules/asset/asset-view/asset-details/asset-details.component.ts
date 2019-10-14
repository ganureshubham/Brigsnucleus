import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetService } from '../../service/asset.service';
import { DataSharingService } from '../../../../public service/data-sharing.service';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css']
})
export class AssetDetailsComponent implements OnInit {
  assetData: any = {}
  constructor(private router: Router, private assetService: AssetService, private dataService: DataSharingService) { }






  ngOnInit() {
    this.dataService.currentData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        this.viewAsset(res);
      }
    })
    
  }

  viewAsset(assetId: number) {
    this.assetService.viewAsset(assetId).subscribe(res => {
      console.log("view function",res);
      
      this.assetData = res.asset;
    },
    error=>{
      console.log(error);
      
    })
  }

  backToList() {
    this.router.navigate(['/asset']);
  }

  addAsset() {
    let selectedAsset = null;
    this.dataService.changeData(selectedAsset);
    this.router.navigate(['/asset/add-asset']);   
  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/
  editAsset(assetId:number) {
    this.dataService.changeData(assetId);
    this.router.navigate(['/asset/add-asset']);
  }




}
