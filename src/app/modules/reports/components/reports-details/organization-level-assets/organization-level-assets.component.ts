import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { ReportsService } from '../../../services/reports.service';
import { SpinnerService } from '../../../../../public service/spinner.service';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-organization-level-assets',
  templateUrl: './organization-level-assets.component.html',
  styleUrls: ['./organization-level-assets.component.css']
})
export class OrganizationLevelAssetsComponent implements OnInit {

  displayedColumns: string[] = ['assetTitle', 'categoryName', 'assetCode', 'modelNumber', 'companyAssetNo', 'organizationName', 'locationType', 'installedLocation'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  isNoRecordFound: boolean = true;
  allassets: any;

  page = 0;
  pageNumber = 0;
  totalCount = 0;

  constructor(
    private snackBar: MatSnackBar,
    private reportsService: ReportsService,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getOrgLevelAssetsPagination(this.pageNumber);
  }

  getOrgLevelAssetsPagination(pageNo) {
    this.spinnerService.setSpinnerVisibility(true);
    this.reportsService.getOrgLevelAssetsPagination(pageNo).subscribe(
      resp => {
        if (resp.status) {
          if (resp.asset.length == 0) {
            this.isNoRecordFound = true;
          } else {
            this.isNoRecordFound = false;
          }
          this.spinnerService.setSpinnerVisibility(false);
          this.dataSource = resp.asset;
          this.pageNumber = resp.currentPage;
          this.totalCount = resp.totalCount;
        } else {
          this.spinnerService.setSpinnerVisibility(false);
          this.showSnackBar(resp.message);
        }
      },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar('Something went wrong..!!');
      }
    );
  }

  exportorglevelassets() {
    this.reportsService.getOrgLevelAssets().subscribe(res => {
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
          let fileName = 'All Assets';
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

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'All Assets': worksheet }, SheetNames: ['All Assets'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
    this.spinnerService.setSpinnerVisibility(false);
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  viewAsset = (asset) => {
    this.router.navigate(['/assetmate/assetmate-details/' + asset.categoryId + '/asset-details/' + asset.assetId]);
  }

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getOrgLevelAssetsPagination(this.page);
  }

}
