import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AssetmateService } from '../../../../../service/assetmate.service';

@Component({
  selector: 'app-asset-assign-new-users',
  templateUrl: './asset-assign-new-users.component.html',
  styleUrls: ['./asset-assign-new-users.component.css']
})
export class AssetAssignNewUsersComponent implements OnInit {

  showFirst: boolean = false;
  assignUserData: any = {};
  formTitle: string = "Add Assigned User";
  isEdited: boolean = false;
  categoryLists: any;
  category: any;
  assignmentLists: any;
  userLists: any;

  @Output() onAssetNewUserAssigned = new EventEmitter<boolean>();

  constructor(
    private assetmateService: AssetmateService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    //Hardcoded for asset
    this.assignUserData.assignmentTypeIdFK = 3;
    this.assignUserData.masterIdFK = Number(this.route.snapshot.params['assetId']);
    this.getcategoryList();
    this.getassignmentLists();
    this.getuserLists();
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
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
      }
    },
      error => {
        console.log(error);
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
    value.masterIdFK = Number(this.route.snapshot.params['assetId']);
    this.assetmateService.addAssignUser(value).subscribe(res => {
      this.showSnackBar(res.message);
      this.onAssetNewUserAssigned.emit(true);
      this.assetmateService.setBadgeUpdateAction('assetDetails', true);
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