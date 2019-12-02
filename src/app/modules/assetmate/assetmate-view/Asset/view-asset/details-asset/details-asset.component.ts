import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetmateService } from '../../../../service/assetmate.service';
import { SpinnerService } from '../../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { AssetCodeComponent } from '../../asset-code/asset-code.component';
import { DataSharingService } from '../../../../../../public service/data-sharing.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-details-asset',
  templateUrl: './details-asset.component.html',
  styleUrls: ['./details-asset.component.css']
})
export class DetailsAssetComponent implements OnInit {

  assetData: any = {};
  showFirst: boolean = false;
  category: any;
  assetcode: any = 'test_code';
  categoryId: number;
  assetId: number;
  userGuideFileExtension: string = '';
  userGuideFileName: string = '';

  constructor(private router: Router,
    private route: ActivatedRoute,
    private assetmateService: AssetmateService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public dataService: DataSharingService,
  ) { }

  ngOnInit() {
    this.assetData.image = "assets/img/user.png";
    console.log(this.assetData);

    this.categoryId = this.route.snapshot.params['categoryId'];
    this.assetId = this.route.snapshot.params['assetId'];
    this.viewAsset();
    this.subscribeToBadgeUpdateService();
  }

  subscribeToBadgeUpdateService() {
    this.assetmateService.getBadgeUpdateAction('assetDetails').subscribe(res => {
      if (res) {
        this.assetmateService.setBadgeUpdateAction('assetDetails', false);
        this.viewAsset();
      }
    });
  }

  viewAsset() {

    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.viewAsset(this.assetId).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.asset) {
        this.assetData = res.asset;
        this.assetcode = res.asset.assetCode;
        console.log(this.assetData);
        // this.userGuideBook = res.asset.userGuideBook.split('/').pop().split('?')[0];
        let arrSplittedUserGuidePath: string[] = res.asset.userGuideBook.split('.');
        this.userGuideFileExtension = arrSplittedUserGuidePath[arrSplittedUserGuidePath.length - 1];
        arrSplittedUserGuidePath = res.asset.userGuideBook.split('/');
        this.userGuideFileName = (arrSplittedUserGuidePath[arrSplittedUserGuidePath.length - 1]).split('.')[0];
      } else {
        this.showSnackBar(res.message);
      }

    },
      error => {
        this.showSnackBar('Something went wrong..!!')
      })

  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  backToList() {
    this.router.navigate([`/assetmate/assetmate-details/${this.categoryId}`]);
  }

  listAsset() {
    this.router.navigate([`/assetmate/assetmate-details/${this.categoryId}`]);
  }

  openQRCodeDialog(assetCode) {
    this.dataService.saveData(assetCode);
    const dialogRef = this.dialog.open(AssetCodeComponent, {
    });
  }

  downloadDocument(file) {
    console.log(file);
    const Ext = file.split('/').pop().split('?')[0]; // splits url into file name
    saveAs(file, Ext);
  }

}
