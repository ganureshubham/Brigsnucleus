import { Component, OnInit, Input } from '@angular/core';
import { DataSharingService } from '../../../../../public service/data-sharing.service';

@Component({
  selector: 'app-asset-code',
  templateUrl: './asset-code.component.html',
  styleUrls: ['./asset-code.component.css']
})
export class AssetCodeComponent implements OnInit {

  
  Assetbarcode: any;

  constructor( public dataService: DataSharingService,) { }

  ngOnInit() {
    this.dataService.mSaveData.subscribe(res=>{
      this.Assetbarcode=res;
    })
   
  }
}
