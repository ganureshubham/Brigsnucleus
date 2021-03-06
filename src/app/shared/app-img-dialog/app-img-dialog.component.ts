import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-app-img-dialog',
  templateUrl: './app-img-dialog.component.html',
  styleUrls: ['./app-img-dialog.component.css']
})
export class AppImgDialogComponent implements OnInit {

  image: any = {};

  constructor(
    public dialogRef: MatDialogRef<AppImgDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.image = this.data;
    this.getDownloadPath();
  }

  isDownloadImageAllowed() {
    return (this.image.imageUrl == undefined) || (this.image.imageUrl == null) || (this.image.imageUrl.length == 0) || this.image.imageType == 'User';
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getImagePath(imageUrl) {
    if ((this.image.imageUrl == undefined) || (this.image.imageUrl == null) || (this.image.imageUrl.length == 0)) {
      return 'assets/img/defaultImage.png';
    }
    return imageUrl;
  }

  getDownloadPath() {

    // console.log('getDownloadPath: ');

    // Image Type to decide download path
    // 1. Complaint
    // 2. Task
    // 3. User
    // 4. Alert
    // 5. Asset

    let basePath = '/allUploads'

    if ((this.image.imageUrl == undefined) || (this.image.imageUrl == null) || (this.image.imageUrl.length == 0)) {
      basePath = '/'
      return basePath;
    } else {
      switch (this.image.imageType) {
        case 'Complaint':
          basePath += '/complaintImages';
          break;
        case 'Task':
          basePath += '/complaintImages';
          break;
        case 'User':
          basePath += '/userImages';
          break;
        case 'Alert':
          basePath += '/alertImages';
          break;
        case 'Asset':
          basePath += '/assetImages';
          break;
        default:
          basePath = '';
      }

      basePath += (this.image.imageUrl.split(':')[2]).substring(4)
      return basePath;
    }

  }

}
