import { Component, OnInit, Inject } from '@angular/core';
import { TaskmateService } from '../../service/taskmate.service';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-taskmate',
  templateUrl: './add-taskmate.component.html',
  styleUrls: ['./add-taskmate.component.css']
})
export class AddTaskmateComponent implements OnInit {

  formTitle: string = 'Add Taskmate';
  taskmateData: any = {};
  assetList: any;
  taskmateerror: any;
  filepath: any;
  cancelbtn = 0;
  userLists: any;
  fileToUpload: File = null;
  taskmateImage: string;
  complaintID: any;



  constructor(
    private taskmateService: TaskmateService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddTaskmateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.getuserLists();
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

  /*********************************************************** Add Taskmate Photo *****************************************************************/

  imageChange(files: FileList) {
    var validImageFormats = ['jpg', 'gif', 'GIF', 'PNG', 'JPEG', 'png', 'jpeg', 'JPG'];
    var extension = files.item(0).name.split('.').pop();
    if (validImageFormats.includes(extension)) {
      this.taskmateerror = "";
      let formData: FormData = new FormData();
      this.fileToUpload = files.item(0);
      formData.append("file", this.fileToUpload, this.fileToUpload.name);
      this.taskmateImage = files.item(0).name;

    } else {
      this.taskmateerror = "please select image only";
    }
  }



  /*********************************************************** Add Taskmate *****************************************************************/


  addTaskmate(value: any) {
    var users = [];
    value.users.forEach(element => {
      users.push({ userIdFK: element })
    });
    value.users = users;
    this.spinnerService.setSpinnerVisibility(true);
    this.taskmateService.addTaskmate(value).subscribe(res => {
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
      this.taskmateService.taskmateImageUpload(this.complaintID, formData).subscribe(res => {
        // callback(res.ImageName)
      })
    }
  }



}