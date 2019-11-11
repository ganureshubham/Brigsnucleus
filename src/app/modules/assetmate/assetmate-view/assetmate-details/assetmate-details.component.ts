import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { AssetmateService } from '../../service/assetmate.service';
import { Location } from '@angular/common';

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
    this.categoryID = this.route.snapshot.params['categoryId'];
    this.getdata();
  }

  getdata() {
    this.assetmateService.getAllRootCateg().subscribe(res => {
      if (res) {
        for (let i = 0; i < (res.rootCategory).length; i++) {
          if (res.rootCategory[i].categoryId == this.categoryID) {
            this.category = res.rootCategory[i];
            break;
          }
        }
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


