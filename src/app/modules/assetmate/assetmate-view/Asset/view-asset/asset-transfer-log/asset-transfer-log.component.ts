import { Component, OnInit } from '@angular/core';
import { AssetmateService } from 'src/app/modules/assetmate/service/assetmate.service';
import { SpinnerService } from 'src/app/public service/spinner.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-asset-transfer-log',
  templateUrl: './asset-transfer-log.component.html',
  styleUrls: ['./asset-transfer-log.component.css']
})
export class AssetTransferLogComponent implements OnInit {

  assetId: number;

  page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  isNoRecordFound: boolean = true;
  arrTransferLogLocation = [];

  constructor(
    private route: ActivatedRoute,
    private assetMateService: AssetmateService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.assetId = this.route.snapshot.params['assetId'];
    this.getAssetTransferLog(this.assetId, this.pageNumber);
  }

  getAssetTransferLog(assetId: number, pageNo) {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetMateService.getAssetTransferLog(assetId, pageNo).subscribe(
      resp => {
        if (resp.status) {
          if (resp.currentPage == 0 && resp.totalCount == 0) {
            this.isNoRecordFound = true;
          } else {
            this.isNoRecordFound = false;
          }
          this.arrTransferLogLocation = resp.locations;
          console.log(this.arrTransferLogLocation);
          this.pageNumber = resp.currentPage;
          this.totalCount = resp.totalCount;
          this.spinnerService.setSpinnerVisibility(false);
        } else {
          this.spinnerService.setSpinnerVisibility(false);
        }
      },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

}
