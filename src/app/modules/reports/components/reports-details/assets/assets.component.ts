import { Component, OnInit } from '@angular/core';
import { AssetmateService } from '../../../../assetmate/service/assetmate.service';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { SpinnerService } from '../../../../../public service/spinner.service';
import { ReportsService } from '../../../services/reports.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit {
  categoryList: any;
  isNoRecordFound: boolean = true;
  page = 0;
  pageNumber = 0;
  totalCount = 0;
  categoryid: number;
  allassets: any;
  categoryname: any;

  tableDataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['assetTitle', 'categoryName', 'assetCode', 'modelNumber', 'companyAssetNo', 'organizationName', 'locationType', 'installedLocation'];

  constructor(
    private assetmateService: AssetmateService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private reportsService: ReportsService,
    private router: Router
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

  onCategoryChange(categId: number, pageNo: number) {
    this.categoryid = categId;
    this.tableDataSource = new MatTableDataSource();
    this.spinnerService.setSpinnerVisibility(true);
    this.reportsService.getAssetList(categId, pageNo).subscribe(res => {
      if (res.status) {
        if (res.asset.length == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.tableDataSource = res.asset;
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
    this.onCategoryChange(this.categoryid, this.page);
  }

  exportAssets() {
    if (this.categoryid == null) {
      this.showSnackBar('Please select category...!!');
    } else {
      this.reportsService.getAllAssetList(this.categoryid).subscribe(res => {
        if (res.status) {
          this.allassets = res.asset;
          if (this.allassets.length > 0) {
            this.spinnerService.setSpinnerVisibility(true);
            let formattedData: any[] = [];
            formattedData = this.allassets.map(obj => ({
              'Asset Title': obj.assetTitle,
              'Category Name': obj.categoryName,
              'Asset Code': obj.assetCode,
              'Model Number': obj.modelNumber,
              'Company AssetNo': obj.companyAssetNo,
              'Organization Name': obj.organizationName,
              'Location Type': obj.locationType,
              'Installed Location': obj.installedLocation,
            }));
            for (let i = 0; i < res.asset.length; i++) {
              this.categoryname = res.asset[i].categoryName;
            }
            let fileName = 'All Assets - ' + this.categoryname;
            this.exportAsExcelFile(formattedData, fileName);
          } else {
            this.showSnackBar('No data to export..!!');
          }
        } else {
          this.spinnerService.setSpinnerVisibility(false);
          this.showSnackBar(res.message);
        }
      },
        err => {
          this.spinnerService.setSpinnerVisibility(false);
          this.showSnackBar('Something went wrong..!!');
        }
      )
    }
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'All assets': worksheet }, SheetNames: ['All assets'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
    this.spinnerService.setSpinnerVisibility(false);
  }

  viewAsset(assetId: number) {

    this.router.navigate(['assetmate/assetmate-details/' + this.categoryid + '/asset-details/' + assetId]);
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }
}
