import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AssetmateService } from '../../../../../service/assetmate.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SpinnerService } from '../../../../../../../public service/spinner.service';

@Component({
  selector: 'app-asset-assign-new-users',
  templateUrl: './asset-assign-new-users.component.html',
  styleUrls: ['./asset-assign-new-users.component.css']
})
export class AssetAssignNewUsersComponent implements OnInit {

  showFirst: boolean = false;
  assignUserData: any = {};
  formTitle: string = "Assign New Users";
  isEdited: boolean = false;
  categoryLists: any;
  category: any;
  assignmentLists: any;
  userLists: any;
  assetId: number;

  @Output() onAssetNewUserAssigned = new EventEmitter<boolean>();

  constructor(
    private assetmateService: AssetmateService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<any>,
    private spinnerService: SpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    //Hardcoded for asset
    this.assignUserData.assignmentTypeIdFK = 3;
    this.assetId = Number(this.data.assetId);
    this.assignUserData.masterIdFK = this.assetId;
    this.getcategoryList();
    this.getassignmentLists();
    this.getuserLists();
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  onNoClick(): void {
    this.dialogRef.close({ action: false });
  }

  /*********************************************************** Get Category List *******************************************************************/
  getcategoryList() {
    this.assetmateService.getAssetLists().subscribe(res => {
      console.log(res)
      if (res.assetList) {
        this.categoryLists = res.assetList;
      }
    },
      error => {
        console.log(error);
      }
    );
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
        this.getAlreadyAssignedUsers();
      }
    },
      error => {
        console.log(error);
      }
    );
  }

  getAlreadyAssignedUsers() {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getAlreadyAssignedUserListForAsset(this.assetId).subscribe(
      res => {
        this.spinnerService.setSpinnerVisibility(false);
        if (res.assignedUsers) {
          let filteredAssignedUser = this.userLists;
          for (let user of res.assignedUsers) {
            filteredAssignedUser = filteredAssignedUser.filter(
              element => {
                return element.userIdFK != user.userIdFK;
              }
            )
          }
          this.userLists = filteredAssignedUser;
        }
      },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  /*********************************************************** Add New Assigned User *******************************************************************/
  addAssignUser(value) {
    let users = []
    value.users.forEach(element => {
      users.push({ userIdFK: element })
    });
    value.users = users;
    value.assignmentTypeIdFK = 3;
    value.masterIdFK = this.assetId;
    this.assetmateService.addAssignUser(value).subscribe(res => {
      this.showSnackBar(res.message);
      // this.onAssetNewUserAssigned.emit(true);
      this.assetmateService.setBadgeUpdateAction('assetDetails', true);
      this.dialogRef.close({ action: true });
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })
  }

  /*********************************************************** Back to Asset List *******************************************************************/
  backToList() {
    this.onAssetNewUserAssigned.emit(false);
  }

}