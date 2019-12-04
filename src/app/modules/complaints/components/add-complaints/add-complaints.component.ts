import { Component, OnInit, Inject } from '@angular/core';
import { ComplaintsService } from '../../service/complaints.service';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SpinnerService } from '../../../../public service/spinner.service';

@Component({
  selector: 'app-add-complaints',
  templateUrl: './add-complaints.component.html',
  styleUrls: ['./add-complaints.component.css']
})
export class AddComplaintsComponent implements OnInit {

  formTitle: string = 'Add Complaint';
  complaintData: any = {};
  assetList: any;
  complainterror: any;
  filepath: any;
  cancelbtn = 0;
  userLists: any;
  fileToUpload: File = null;
  complaintImage: string;
  complaintID: any;



  constructor(
    private complaintsService: ComplaintsService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddComplaintsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.selectAssetTitle();
    this.getuserLists();
  }


  /*********************************************************** Select Asset Title *****************************************************************/

  selectAssetTitle() {
    this.complaintsService.selectAssetTitle().subscribe(res => {
      if (res.asset) {
        this.assetList = res.asset;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
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

  /*********************************************************** Add Asset Photo *****************************************************************/
  imageChange(files: FileList) {
    var validImageFormats = ['jpg', 'gif', 'GIF', 'PNG', 'JPEG', 'png', 'jpeg', 'JPG'];
    var extension = files.item(0).name.split('.').pop();
    if (validImageFormats.includes(extension)) {
      this.complainterror = "";
      let formData: FormData = new FormData();
      this.fileToUpload = files.item(0);
      formData.append("file", this.fileToUpload, this.fileToUpload.name);
      this.complaintImage = files.item(0).name;

    } else {
      this.complainterror = "please select image only";
    }
  }



  /*********************************************************** Add Complaint *****************************************************************/


  addComplaint(value: any) {
    var users = [];
    value.users.forEach(element => {
      users.push({ userIdFK: element })
    });
    value.users = users;
    this.spinnerService.setSpinnerVisibility(true);
    this.complaintsService.addComplaint(value).subscribe(res => {
      if (res.status == true) {
        this.complaintID = res.complaintId;
        this.uploadImageToserver()
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


  uploadImageToserver = () => {
    if (this.fileToUpload == null) {
      //callback(this.complaintImage)
    } else {
      let formData: FormData = new FormData();
      formData.append("file", this.fileToUpload, this.fileToUpload.name);
      this.complaintsService.imageUpload(this.complaintID, formData).subscribe(res => {
        // callback(res.ImageName)
      })
    }
  }



}
