import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TaskmateService } from '../../service/taskmate.service';
import { DialogService } from '../../../../public service/dialog.service';
import { SpinnerService } from '../../../../public service/spinner.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-taskmate-transfer',
  templateUrl: './add-taskmate-transfer.component.html',
  styleUrls: ['./add-taskmate-transfer.component.css']
})
export class AddTaskmateTransferComponent implements OnInit {

  formTitle: string = 'Transfer Taskmate';
  taskmateTransferData: any = {};
  cancelbtn = 0;
  userLists: any;
  responsibleuserlist: any;
  categoryID: any;

  constructor(
    private taskmateService: TaskmateService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddTaskmateTransferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.categoryID = this.data.complaintid;
    this.getuserLists();
    this.getResponsibleUser();
  }


  /*********************************************************** Select User List *******************************************************************/

  getuserLists() {
    this.taskmateService.getuserLists().subscribe(res => {
      if (res.user) {
        this.userLists = res.user;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }


  /*********************************************************** Select Responsible User List *******************************************************************/

  getResponsibleUser() {
    this.taskmateService.getResponsibleUser(this.categoryID).subscribe(res => {
      if (res.responsibleUsersList) {
        this.responsibleuserlist = res.responsibleUsersList;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })
  }


  /*********************************************************** Add New Transfer Complaint *******************************************************************/


  addTransferTask(value: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.taskmateService.addTransferTask(this.categoryID, value).subscribe(res => {
      if (res.status == true) {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar(res.message);
        this.dialog.closeAll();
      }
      else {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }



}
