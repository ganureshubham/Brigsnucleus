import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TaskmateService } from '../../service/taskmate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppImgDialogComponent } from 'src/app/shared/app-img-dialog/app-img-dialog.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-details-taskmate',
  templateUrl: './details-taskmate.component.html',
  styleUrls: ['./details-taskmate.component.css']
})
export class DetailsTaskmateComponent implements OnInit {
  taskmateData: any = {};
  complaintID: any;

  constructor(
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private taskmateService: TaskmateService,
    private routes: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.complaintID = this.routes.snapshot.params['complaintId'];
    this.viewParticularTaskmate();
    this.taskmateData.complaintImage = 'assets/img/complaint.jpg';
  }


  viewParticularTaskmate() {
    this.spinnerService.setSpinnerVisibility(true);
    this.taskmateService.viewParticularTaskmate(this.complaintID).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.task) {
        this.taskmateData = res.task[0];
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
      data: { imageType: 'Task', imageTitle: title, imageUrl: imageUrl, },
      width: '90vw',
      height: '80vh',
      panelClass: 'app-img-dialog',
      backdropClass: 'app-img-dialog-backdrop'
    });
  }

  getTaskmateImagePath(imageUrl) {
    if (imageUrl != null && imageUrl.length > 0) {
      return imageUrl;
    }
    return 'assets/img/defaultImage.png';
  }

}
