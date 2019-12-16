import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { ReportsService } from '../../../services/reports.service';
import { SpinnerService } from '../../../../../public service/spinner.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { Router } from '@angular/router';

import { from } from 'rxjs';
@Component({
  selector: 'app-pending-tasks',
  templateUrl: './pending-tasks.component.html',
  styleUrls: ['./pending-tasks.component.css']
})
export class PendingTasksComponent implements OnInit {

  topCount: number = -1;
  isNoRecordFound: boolean = true;
  totalTasks: any;
  total: any;
  tableDataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['title', 'typeOfComplaint', 'complaintStatus', 'typeOfUser', 'raisedByName', 'createdDate'];

  constructor(
    private snackBar: MatSnackBar,
    private reportsService: ReportsService,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onTopCountChange(count) {
    this.topCount = count;
    this.tableDataSource = new MatTableDataSource();
    this.spinnerService.setSpinnerVisibility(true);
    this.reportsService.getPendingTasks(this.topCount).subscribe(
      res => {
        if (res.status) {
          if (res.TasksList && res.TasksList == 0) {
            this.isNoRecordFound = true;
          } else {
            this.isNoRecordFound = false;
          }
          this.tableDataSource = res.TasksList;
          this.totalTasks = res.TasksList;
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
    if (this.topCount == -1) {
      this.showSnackBar('Please choose top pending complaints count..!!')
    } else {
      if (this.totalTasks.length > 0) {
        this.spinnerService.setSpinnerVisibility(true);
        let formattedData: any[] = [];
        formattedData = this.totalTasks.map(obj => ({
          "Task Title": obj.title,
          "Type": obj.typeOfComplaint,
          "Task Status": obj.complaintStatus,
          "Type Of User": obj.typeOfUser,
          "Raised By": obj.raisedByName,
          "Created On": obj.createdDate
        }));
        let fileName = this.topCount == 0 ? 'All Pending Tasks' : 'Top ' + this.topCount + ' Pending Tasks';
        this.exportAsExcelFile(formattedData, fileName);
      } else {
        this.showSnackBar('No data to export..!!');
      }
    }
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'Pending Tasks': worksheet }, SheetNames: ['Pending Tasks'] };
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

  viewTaskmate(complaintId: number) {
    this.router.navigate(['taskmate/details-taskmate/' + complaintId]);
  }

}
