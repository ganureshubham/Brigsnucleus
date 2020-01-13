import { Component, OnInit } from '@angular/core';
import { AssetmateService } from '../../../../assetmate/service/assetmate.service';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { SpinnerService } from '../../../../../public service/spinner.service';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit {
  categoryList: any;
  isNoRecordFound: boolean = true;
  totalAssets: any;
  page = 0;
  pageNumber = 0;
  totalCount = 0;

  tableDataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['assetTitle', 'categoryName', 'assetCode', 'modelNumber', 'companyAssetNo', 'organizationName', 'locationType', 'installedLocation'];
  categoryid: number;

  constructor(
    private assetmateService: AssetmateService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private reportsService: ReportsService
  ) { }

  ngOnInit() {
    this.selectCategory();
  }

  /*************************************************** Select Category List***************************************************************************/

  selectCategory() {
    this.assetmateService.getAllRootCateg().subscribe(res => {
      if (res.status) {
        this.categoryList = res.rootCategory;
      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.showSnackBar('Something went wrong!!');
      })
  }

  onCategoryChange(categId: number) {
    this.categoryid = categId;
    this.tableDataSource = new MatTableDataSource();
    this.spinnerService.setSpinnerVisibility(true);
    this.reportsService.getAssetList(categId, this.pageNumber).subscribe(res => {
      if (res.status) {
        if (res.asset.length == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.tableDataSource = res.asset;
        this.totalAssets = res.asset;
        this.totalCount = res.totalCount;
        this.pageNumber = res.currentPage;
        this.spinnerService.setSpinnerVisibility(false);
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

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.onCategoryChange(this.page);
  }




  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }
}
