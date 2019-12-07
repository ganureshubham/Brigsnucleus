import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../../../../service/assetmate.service';
import { DataSharingService } from '../../../../../../public service/data-sharing.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-assign-user',
  templateUrl: './add-assign-user.component.html',
  styleUrls: ['./add-assign-user.component.css']
})
export class AddAssignUserComponent implements OnInit {
  showFirst: boolean = false;
  assignUserData: any = {};
  formTitle: string = "Add Assigned User";
  isEdited: boolean = false;
  categoryLists: any;
  category: any;
  assignmentLists: any;
  userLists: any;
  categoryId;


  constructor(
    private assetmateService: AssetmateService,
    private dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.categoryId = Number(this.data.categoryId);

    //Hardcoded for the category option;
    this.assignUserData.assignmentTypeIdFK = 1;
    this.assignUserData.masterIdFK = this.categoryId;
    this.getcategoryList();
    this.getassignmentLists();
    this.getuserLists();
  }
  /*********************************************************** Get Category List *******************************************************************/

  getcategoryList() {
    this.assetmateService.getcategoryList().subscribe(res => {
      if (res.AssetCategory) {
        this.categoryLists = res.AssetCategory;
      }
    },
      error => {
        console.log(error);
      }
    );
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  onNoClick(): void {
    this.dialogRef.close({ action: false });
  }


  /*********************************************************** Get Assignment List *******************************************************************/

  getassignmentLists() {
    this.assetmateService.getassignmentLists().subscribe(res => {
      if (res.assignmentType) {
        this.assignmentLists = res.assignmentType;
      }
    },
      error => {
        console.log(error);
      }
    );
  }

  /*********************************************************** Get User List *******************************************************************/

  getuserLists() {
    this.assetmateService.getuserLists().subscribe(res => {
      if (res.user) {
        this.userLists = res.user;
      }
    },
      error => {
        console.log(error);
      }
    );
  }





  /*********************************************************** Add New Assigned User *******************************************************************/
  addAssignUser(value) {
    this.spinnerService.setSpinnerVisibility(true);
    let users = []
    value.users.forEach(element => {
      users.push({ userIdFK: element })
    });
    value.users = users;
    value.assignmentTypeIdFK = 1;
    value.masterIdFK = Number(this.categoryId);
    this.assetmateService.addAssignUser(value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.showFirst = !this.showFirst;
      this.assetmateService.setBadgeUpdateAction('assetList', true);
      this.dialogRef.close({ action: true });
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })
  }

  /*********************************************************** Back to Asset List *******************************************************************/

  backToList() {
    let categorydata = localStorage.getItem('Category-Object');
    this.category = JSON.parse(categorydata);
    this.dataService.changeData(this.category);
    this.showFirst = !this.showFirst;
    // this.router.navigate(['/asset']);   

  }

}