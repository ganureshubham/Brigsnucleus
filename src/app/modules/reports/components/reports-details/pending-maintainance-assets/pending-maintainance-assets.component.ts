import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { ReportsService } from '../../../services/reports.service';
import { SpinnerService } from '../../../../../public service/spinner.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-maintainance-assets',
  templateUrl: './pending-maintainance-assets.component.html',
  styleUrls: ['./pending-maintainance-assets.component.css']
})
export class PendingMaintainanceAssetsComponent implements OnInit {

  displayedColumns: string[] = ['assetTitle', 'companyAssetNo', 'assetCode', 'categoryName', 'modelNumber'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  pendingMaintainanceAssets: any = [];
  isNoRecordFound: boolean = true;

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
    this.getPendingMaintainanceAssets(this.pageNumber);
  }

  getPendingMaintainanceAssets(pageNo) {
    this.spinnerService.setSpinnerVisibility(true);
    this.reportsService.getPendingMaintainanceAssets(pageNo).subscribe(
      resp => {
        this.spinnerService.setSpinnerVisibility(false);
        if (resp && resp.totalMaintenceRemainingAssets) {
          console.log(resp);

          if (resp.totalMaintenceRemainingAssets.length == 0) {
            this.isNoRecordFound = true;
          } else {
            this.isNoRecordFound = false;
          }
          this.dataSource = resp.totalMaintenceRemainingAssets;
          this.pageNumber = resp.currentPage;
          this.totalCount = resp.totalCount;
        } else {
          this.showSnackBar(resp.message);
        }
      },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar('Something went wrong..!!');
      }
    );
  }

  exportpendingmaintainance() {
    this.reportsService.getAllPendingMaintainanceAssets().subscribe(res => {
      if (res.status) {
        this.pendingMaintainanceAssets = res.totalMaintenceRemainingAssets;
        if (this.pendingMaintainanceAssets.length > 0) {
          this.spinnerService.setSpinnerVisibility(true);
          let formattedData: any[] = [];
          formattedData = this.pendingMaintainanceAssets.map(obj => ({
            "Asset Title": obj.assetTitle,
            "Company Asset No": obj.companyAssetNo,
            "Asset Code": obj.assetCode,
            "Category Name": obj.categoryName,
            "Model Number": obj.modelNumber
          }));
          let fileName = 'All Pending maintainance assets';
          this.exportAsExcelFile(formattedData, fileName);
        } else {
          this.showSnackBar('No data to export..!!');
        }
      } else {
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
    const workbook: XLSX.WorkBook = { Sheets: { 'Pending maintainance assets': worksheet }, SheetNames: ['Pending maintainance assets'] };
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
    console.log('view', asset);

    this.router.navigate(['/assetmate/assetmate-details/' + asset.categoryId + '/asset-details/' + asset.assetId]);
  }

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getPendingMaintainanceAssets(this.page);
  }

}
