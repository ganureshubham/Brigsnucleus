import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ComplaintsService } from '../../service/complaints.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details-complaints',
  templateUrl: './details-complaints.component.html',
  styleUrls: ['./details-complaints.component.css']
})
export class DetailsComplaintsComponent implements OnInit {
  complaintData: any = {};
  complaintID: any;

  constructor(
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private complaintsService: ComplaintsService,
    private routes: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.complaintID = this.routes.snapshot.params['complaintId'];
    this.viewComplaint();
    this.complaintData.complaintImage = 'assets/img/complaint.jpg';
  }


  viewComplaint() {
    this.spinnerService.setSpinnerVisibility(true);
    this.complaintsService.viewComplaint(this.complaintID).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.complaint) {
        this.complaintData = res.complaint[0];
      } else {
        this.showSnackBar(res.message);
      }

    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar('Something went wrong..!!');

      })

  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }


  backToList() {
    this.router.navigate(['/complaints'])
  }

}
