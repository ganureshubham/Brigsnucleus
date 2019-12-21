import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { SpinnerService } from '../../../../public service/spinner.service';
import { VerifyAssetService } from '../../service/verify-asset.service';
import { AssetmateService } from '../../../assetmate/service/assetmate.service';
import { AppDialogData } from '../../../../model/appDialogData';
import { DialogService } from '../../../../public service/dialog.service';
import { Subscription } from 'rxjs';

interface Asset {
  assetId: number;
  isActive: string;
  assetCodeImage: string;
  assetCode: number;
  assetImage: string;
  assetTitle: string;
  categoryName: string;
  modelNumber: string;
  companyAssetNo: string;
}

@Component({
  selector: 'app-verify-asset-list',
  templateUrl: './verify-asset-list.component.html',
  styleUrls: ['./verify-asset-list.component.css']
})
export class VerifyAssetListComponent implements OnInit {

  displayedColumns: string[] = ['assetTitle', 'addedBy', 'action'];

  count: number;
  pageNumber = 0;
  totalCount = 0;
  page: number = 0;
  deleteAssetWithId: number;
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  isNoRecordFound: boolean = false;

  dataSource: MatTableDataSource<Asset> = new MatTableDataSource();

  dialogServiceSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private verifyAssetService: VerifyAssetService,
    private assetmateService: AssetmateService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getAllPendingVerificationAssets(this.pageNumber);
  }

  ngOnDestroy() {
    this.dialogServiceSubscription.unsubscribe();
  }

  navigateToAssetDetails(assetId) {
    let categoryId = 1;
    this.router.navigate(['/assetmate/assetmate-details/' + categoryId + '/asset-details/' + assetId]);
  }

  /***************************************** Get List Of Pending Verification Assets *******************************************************************************/

  getAllPendingVerificationAssets(pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getAllPendingVerificationAssets(pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
          this.showSnackBar(res.message);
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = res.Assets;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getAllPendingVerificationAssets(this.page);
  }

  /***************************************** Verify Particular Asset *******************************************************************************/

  verifiedAsset(assetId: number) {
    let body = {
      isVerified: 1
    }
    this.spinnerService.setSpinnerVisibility(true);
    this.verifyAssetService.verifyAsset(assetId, body).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.showSnackBar(res.message);
        this.getAllPendingVerificationAssets(this.pageNumber);
      } else {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /***************************************** Delete Particular Asset *******************************************************************************/

  deleteAsset(assetId: number, assetTitle: string) {
    this.deleteAssetWithId = assetId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE ASSET',
      message: `Are your sure you want to delete asset "${assetTitle}" ?`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel",
      action: "verify-asset"
    }
    this.dialogService.setDialogVisibility(appDialogData);
    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogServiceSubscription = this.dialogService.getUserDialogAction().subscribe((resp: any) => {
        if (resp.result == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (resp.result == 1) {
          if (resp.action == "verify-asset") {
            this.dialogService.setUserDialogAction(0);
            //User has approved delete operation 
            this.spinnerService.setSpinnerVisibility(true);
            this.assetmateService.deleteAsset(this.deleteAssetWithId).subscribe(res => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar(res.message);
              this.getAllPendingVerificationAssets(this.pageNumber);
            }, error => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar("Something went wrong..!!");
            });
          }
        }
      })
    }
  }

}
