import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { ReportsService } from '../../../services/reports.service';
import { SpinnerService } from '../../../../../public service/spinner.service';

@Component({
  selector: 'app-pending-tasks',
  templateUrl: './pending-tasks.component.html',
  styleUrls: ['./pending-tasks.component.css']
})
export class PendingTasksComponent implements OnInit {

  topCount: number = -1;
  isNoRecordFound: boolean = true;
  total: any;
  tableDataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['title', 'typeOfComplaint', 'complaintStatus', 'typeOfUser', 'raisedByName', 'createdDate'];

  constructor(
    private snackBar: MatSnackBar,
    private reportsService: ReportsService,
    private spinnerService: SpinnerService,
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
      console.log('complaintTableDataSource');
      console.log(this.tableDataSource);
    }
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

}
