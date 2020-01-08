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
  selector: 'app-pending-complaints',
  templateUrl: './pending-complaints.component.html',
  styleUrls: ['./pending-complaints.component.css']
})
export class PendingComplaintsComponent implements OnInit {

  topComplaintsCount: number = -1;
  isNoRecordFound: boolean = true;
  totalComplaints: any;
  complaintData: any;
  complaintTableDataSource: MatTableDataSource<any> = new MatTableDataSource();
  complaintsColumns: string[] = ['title', 'typeOfComplaint', 'assetTitle', 'assetCode', 'complaintStatus', 'typeOfUser', 'raisedByName', 'createdOn'];

  constructor(
    private snackBar: MatSnackBar,
    private reportsService: ReportsService,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onTopPendingComplaintsCountChange(count) {
    this.topComplaintsCount = count;
    this.complaintTableDataSource = new MatTableDataSource();
    this.spinnerService.setSpinnerVisibility(true);
    this.reportsService.getPendingComplaints(this.topComplaintsCount).subscribe(
      res => {
        if (res.status) {
          if (res.complaintList && res.complaintList == 0) {
            this.isNoRecordFound = true;
          } else {
            this.isNoRecordFound = false;
          }
          this.complaintTableDataSource = res.complaintList;
          this.complaintData = res.complaintList;
          this.spinnerService.setSpinnerVisibility(false);
        } else {
          this.spinnerService.setSpinnerVisibility(false);
          this.showSnackBar(res.message);
        }
      },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  exportTopComplaints() {
    if (this.topComplaintsCount == -1) {
      this.showSnackBar('Please choose top pending complaints count..!!');
    } else {
      if (this.complaintData.length > 0) {
        this.spinnerService.setSpinnerVisibility(true);
        let formattedComplaintData: any[] = [];
        formattedComplaintData = this.complaintData.map(obj => ({
          "Complaint Title": obj.title,
          "Type Of Complaint": obj.typeOfComplaint,
          "Asset Title": obj.assetTitle,
          "Asset Code": obj.assetCode,
          "Complaint Status": obj.complaintStatus,
          "Type Of User": obj.typeOfUser,
          "Created On": obj.createdDate,
          "Raised By": obj.raisedByName,
          "Message": obj.message
        }));
        let fileName = this.topComplaintsCount == 0 ? 'All Pending Complaints' : 'Top ' + this.topComplaintsCount + ' Pending Complaints';
        this.exportAsExcelFile(formattedComplaintData, fileName);
      } else {
        this.showSnackBar('No data to export..!!');
      }
    }
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'Pending Complaints': worksheet }, SheetNames: ['Pending Complaints'] };
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

  viewComplaint(complaintId: number) {
    this.router.navigate(['complaints/details-complaints/' + complaintId]);
  }

}
