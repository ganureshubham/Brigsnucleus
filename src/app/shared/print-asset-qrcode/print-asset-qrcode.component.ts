import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetmateService } from '../../modules/assetmate/service/assetmate.service'
import { SpinnerService } from '../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-print-asset-qrcode',
  templateUrl: './print-asset-qrcode.component.html',
  styleUrls: ['./print-asset-qrcode.component.css']
})
export class PrintAssetQrcodeComponent implements OnInit {

  private assetId: number;
  assetData: any = {};
  assetCode: string = "1";
  isPrintBtnHidden: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private assatemateService: AssetmateService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.assetId = this.activatedRoute.snapshot.params['assetId'];
    this.getAssetDetails();
  }

  getAssetDetails() {
    this.spinnerService.setSpinnerVisibility(true);

    this.assatemateService.getDetails(this.assetId).subscribe(res => {

      if (res.asset) {
        this.spinnerService.setSpinnerVisibility(false);
        this.assetData = res.asset
        this.assetCode = this.assetData.assetCode;
        setTimeout(() => {
          this.isPrintBtnHidden = true;
          this.printDiv();
        }, 200);
      } else {
        this.showSnackBar(res.message)
      }

    }, err => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar('Something went wrong..!!');
    })

  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  printDiv() {
    this.isPrintBtnHidden = true;
    setTimeout(() => {
      window.print();
      this.isPrintBtnHidden = false;
    }, 50);

    // document.body.innerHTML = originalContents;
  }

}
