import { Component, OnInit } from '@angular/core';
import { DataSharingService } from '../../../public service/data-sharing.service';

@Component({
  selector: 'app-documate-code',
  templateUrl: './documate-code.component.html',
  styleUrls: ['./documate-code.component.css']
})
export class DocumateCodeComponent implements OnInit {
  documateCode: any;

  constructor(public dataService: DataSharingService, ) { }

  ngOnInit() {
    this.dataService.mSaveData.subscribe(res => {
      this.documateCode = res;
    })
  }

}
