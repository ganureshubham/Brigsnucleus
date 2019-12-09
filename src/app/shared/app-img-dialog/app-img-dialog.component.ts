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
    this.getDownloadPath()
  }

  closeDialog() {
    this.dialogRef.close();
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
    // console.log('basePath : ' + basePath);
    return basePath;

  }

}
