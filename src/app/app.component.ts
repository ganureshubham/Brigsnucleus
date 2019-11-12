import { Component, OnInit, Inject } from '@angular/core';
import { SpinnerService } from './public service/spinner.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogService } from './public service/dialog.service';
import { AppDialogData } from './model/appDialogData';

export interface DialogData {
  title: string;
  message: string;
  positiveBtnLable: string;
  negativeBtnLable: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'brigsnucleus';
  shouldSpinnerVisible: boolean = false;
  userAction: number = 0;
  name: string;
  isAppDialogAlreadyOpened: boolean = false;

  constructor(
    private spinnerService: SpinnerService,
    public dialog: MatDialog,
    private dialogService: DialogService,
  ) {
  }

  ngOnInit() {
    this.subscribeToSpinnerService();
    this.subscribeToDialogService();
  }

  subscribeToSpinnerService() {
    this.spinnerService.showSpinner.subscribe(result => {
      this.shouldSpinnerVisible = result;
    });
  }

  subscribeToDialogService() {
    this.dialogService.getDialogVisibility().subscribe((resp: AppDialogData) => {
      if (resp.visibilityStatus && !this.isAppDialogAlreadyOpened) {
        this.isAppDialogAlreadyOpened = true;
        this.openDialog(resp);
      }
    })
  }

  openDialog(appDialogData: AppDialogData): void {

    const dialogRef = this.dialog.open(AppDialog, {
      width: '40vw',
      data: {
        title: appDialogData.title,
        message: appDialogData.message,
        positiveBtnLable: appDialogData.positiveBtnLable,
        negativeBtnLable: appDialogData.negativeBtnLable
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.userAction = result;
      this.dialogService.setUserDialogAction(this.userAction);
      this.isAppDialogAlreadyOpened = false;
    });

  }

}

@Component({
  selector: 'app-dialog',
  templateUrl: './app-dialog.html',
  styleUrls: ['./app-dialog.css']
})
export class AppDialog {

  userActionPositiveBtnClicked = 1;
  userActionNegativeBtnClicked = 0;

  constructor(
    public dialogRef: MatDialogRef<AppDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
