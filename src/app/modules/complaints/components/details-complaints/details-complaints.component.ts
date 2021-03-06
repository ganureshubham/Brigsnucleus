import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ComplaintsService } from '../../service/complaints.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppImgDialogComponent } from 'src/app/shared/app-img-dialog/app-img-dialog.component';
import { Location } from '@angular/common';

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
    private router: Router,
    private location: Location
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
    this.location.back();
  }

  priviewImage(title, imageUrl) {
    this.dialog.open(AppImgDialogComponent, {
      data: { imageType: 'Complaint', imageTitle: title, imageUrl: imageUrl, },
      width: '90vw',
      height: '80vh',
      panelClass: 'app-img-dialog',
      backdropClass: 'app-img-dialog-backdrop'
    });
  }

  getComplaintImagePath(imageUrl) {
    if (imageUrl != null && imageUrl.length > 0) {
      return imageUrl;
    }
    return 'assets/img/defaultImage.png';
  }

}
