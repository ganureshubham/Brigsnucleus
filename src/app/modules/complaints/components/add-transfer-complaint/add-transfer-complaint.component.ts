import { Component, OnInit, Inject } from '@angular/core';
import { ComplaintsService } from '../../service/complaints.service';
import { DialogService } from '../../../../public service/dialog.service';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SpinnerService } from '../../../../public service/spinner.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-transfer-complaint',
  templateUrl: './add-transfer-complaint.component.html',
  styleUrls: ['./add-transfer-complaint.component.css']
})
export class AddTransferComplaintComponent implements OnInit {

  formTitle: string = 'Add Transfer Complaint';
  complaintTransferData: any = {};
  cancelbtn = 0;
  userLists: any;
  responsibleuserlist: any;
  categoryID: any;

  constructor(
    private complaintsService: ComplaintsService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddTransferComplaintComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.categoryID = this.data.complaintid;
    this.getuserLists();
    this.getResponsibleUser();
  }


  /*********************************************************** Select User List *******************************************************************/

  getuserLists() {
    this.complaintsService.getuserLists().subscribe(res => {
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
    this.complaintsService.getResponsibleUser(this.categoryID).subscribe(res => {
      if (res.responsibleUsersList) {
        this.responsibleuserlist = res.responsibleUsersList;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })
  }


  /*********************************************************** Add New Transfer Complaint *******************************************************************/


  addComplaintTransfer(value: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.complaintsService.addComplaintTransfer(this.categoryID, value).subscribe(res => {
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
