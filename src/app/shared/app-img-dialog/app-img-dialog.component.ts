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
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getDownloadPath() {
    console.log((this.image.imageUrl.split(':')[2]).substring(4));

    return (this.image.imageUrl.split(':')[2]).substring(4);
  }

}
