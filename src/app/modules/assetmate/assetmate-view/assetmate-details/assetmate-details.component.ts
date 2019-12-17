import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { AssetmateService } from '../../service/assetmate.service';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-assetmate-details',
  templateUrl: './assetmate-details.component.html',
  styleUrls: ['./assetmate-details.component.css'],
})
export class AssetmateDetailsComponent implements OnInit {

  categoryID: any;
  category: any = [{}];
  selectedTab = new FormControl(0);

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
    this.subscribeToBadgeUpdateService();
    this.subscribeToTABService();
  }

  getdata() {
    this.assetmateService.getCategoryPrimaryInfo(this.categoryID).subscribe(res => {
      if (res.allCategory) {
        this.category = res.allCategory[0];
      }
    },
      error => {
        console.log(error.error.message);
      })
  }

  subscribeToBadgeUpdateService() {
    this.assetmateService.getBadgeUpdateAction('assetList').subscribe(res => {
      if (res) {
        this.assetmateService.setBadgeUpdateAction('assetList', false);
        this.getdata();
      }
    });
  }

  subscribeToTABService() {
    this.assetmateService.getTabSelection('checklistTab').subscribe(res => {
      if (res == 1 && (this.selectedTab.value == 0)) {
        this.selectedTab = new FormControl(1);
      } else if (res == 0) {
        this.selectedTab = new FormControl(0);
      }
    });
  }

  backToList() {
    this.assetmateService.setTabSelection('checklistTab', 0);
    this.router.navigate(['/assetmate']);
  }

  goto() {
    this.router.navigate(['/assetmate/asset-add']);
  }

  getSelectedTabIndex() {
    return this.selectedTab.value;
  }

}


