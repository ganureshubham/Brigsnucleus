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
  selector: 'app-critical-condition-assets',
  templateUrl: './critical-condition-assets.component.html',
  styleUrls: ['./critical-condition-assets.component.css']
})
export class CriticalConditionAssetsComponent implements OnInit {

  displayedColumns: string[] = ['assetTitle', 'companyAssetNo', 'assetCode', 'categoryName', 'modelNumber'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  criticalConditionAssets: any = [];
  isNoRecordFound: boolean = true;

  constructor(
    private snackBar: MatSnackBar,
    private reportsService: ReportsService,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllCriticalConditionAssets();
  }

  getAllCriticalConditionAssets() {
    this.spinnerService.setSpinnerVisibility(true);
    this.reportsService.getAllCriticalConditionAssets().subscribe(
      resp => {
        this.spinnerService.setSpinnerVisibility(false);
        if (resp && resp.data) {
          if (resp.data.length == 0) {
            this.isNoRecordFound = true;
          } else {
            this.isNoRecordFound = false;
          }
          this.criticalConditionAssets = resp.data;
          this.dataSource = resp.data;
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

  exportTopComplaints() {

    if (this.criticalConditionAssets.length > 0) {
      this.spinnerService.setSpinnerVisibility(true);
      let formattedData: any[] = [];
      formattedData = this.criticalConditionAssets.map(obj => ({
        "Asset Title": obj.assetTitle,
        "Asset Code": obj.assetCode,
        "Company Asset No": obj.companyAssetNo,
        "Category Name": obj.categoryName,
        "Model Number": obj.modelNumber
      }));
      let fileName = 'Critical condition assets';
      this.exportAsExcelFile(formattedData, fileName);
    } else {
      this.showSnackBar('No data to export..!!');
    }

  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'Critical Cond Assets': worksheet }, SheetNames: ['Critical Cond Assets'] };
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

}
