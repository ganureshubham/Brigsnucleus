import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms'; 
import { AssetmateService } from '../../../../service/assetmate.service';
import { DataSharingService } from '../../../../../../public service/data-sharing.service';
import { forEach } from '@angular/router/src/utils/collection';
import { element } from 'protractor';


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


  constructor(
    private assetmateService: AssetmateService,
    private dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    // this.dataService.mSaveData.subscribe(res=>{
    //   if (res != null && res != "null" && res != "null"){
    //     console.log('doc edit res',res);
    //     this.documentData=res;
    //     this.filepath = res.filepath.split('/').pop().split('?')[0];

        
    //     this.isEdited = true;
    //     this.formTitle = `Edit Document`;
    //   }
    // })
    // this.getDocumentList();
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
      users.push({userIdFK:element})
    });
    value.users= users;
    console.log('assign user value',JSON.stringify(value));
    this.assetmateService.addAssignUser(value).subscribe(res => {
      this.spinner.show();
      setTimeout(() => {
        this.toastr.success(res.message);
        let categorydata = localStorage.getItem('Category-Object');  
                this.category = JSON.parse(categorydata);
                this.dataService.changeData(this.category);
        this.showFirst = !this.showFirst;
        // this.router.navigate(['/asset']);
        this.spinner.hide();
      }, 1000);
    },
      error => {
        console.log(error);
        this.toastr.error(error.error.message);
      })
  }


 
/*********************************************************** Edit Document *******************************************************************/
editAssignUser(){}
  // editDocument(formData: NgForm) {
  //   let value = formData.value;
  //   if (formData.valid) {
  //     this.uploadDocToserver((result1) => {
  //       value.filepath = result1;
  //       // console.log(JSON.stringify(value));
  //       this.assetmateService.editDocument(this.documentData.documentId,value).subscribe(
  //         res => {
  //           this.spinner.show();
  //           setTimeout(() => {
  //             this.toastr.success(res.message);
  //             let categorydata = localStorage.getItem('Category-Object');
  //             this.category = JSON.parse(categorydata);
  //             this.dataService.changeData(this.category);
  //             this.showFirst = !this.showFirst;
  //             // this.router.navigate(['/asset']); 
  //             this.spinner.hide();
  //           }, 1000);
  //         },
  //         error => {
  //           this.toastr.error(error.message);
  //         }
  //       );
  //     })
  //   }

  //  }


   /*********************************************************** Back to Asset List *******************************************************************/

   backToList() {
    let categorydata = localStorage.getItem('Category-Object');
    this.category = JSON.parse(categorydata);
    this.dataService.changeData(this.category);
    this.showFirst = !this.showFirst;
    // this.router.navigate(['/asset']);   

  }

}