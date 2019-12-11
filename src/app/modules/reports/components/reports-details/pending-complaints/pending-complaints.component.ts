import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { ReportsService } from '../../../services/reports.service';
import { SpinnerService } from '../../../../../public service/spinner.service';

@Component({
  selector: 'app-pending-complaints',
  templateUrl: './pending-complaints.component.html',
  styleUrls: ['./pending-complaints.component.css']
})
export class PendingComplaintsComponent implements OnInit {

  topComplaintsCount: number = -1;
  isNoRecordFound: boolean = true;
  totalComplaints: any;
  complaintTableDataSource: MatTableDataSource<any> = new MatTableDataSource();
  complaintsColumns: string[] = ['title', 'typeOfComplaint', 'assetTitle', 'assetCode', 'complaintStatus', 'typeOfUser', 'raisedByName', 'createdOn'];

  constructor(
    private snackBar: MatSnackBar,
    private reportsService: ReportsService,
    private spinnerService: SpinnerService,
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
      this.showSnackBar('Please choose top pending complaints count..!!')
    } else {
      console.log('complaintTableDataSource');
      console.log(this.complaintTableDataSource);
    }
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

}
