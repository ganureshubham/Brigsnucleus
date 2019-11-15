import { Component, OnInit } from '@angular/core';
import { AssetmateService } from '../../../../service/assetmate.service';
import { DataSharingService } from '../../../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-checklist-add',
  templateUrl: './checklist-add.component.html',
  styleUrls: ['./checklist-add.component.css']
})
export class ChecklistAddComponent implements OnInit {

  categoryList: any;
  checklistData: any = {};
  showFirst: boolean = false;
  formTitle: string = "Add Checklist";
  category: any;
  isEdited: boolean = false;
  categoryID: any;
  durationList: any;

  constructor(private assetmateService: AssetmateService,
    private dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) { }


  ngOnInit() {
    this.categoryID = this.route.snapshot.params['categoryId'];
    this.dataService.mSaveData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        this.checklistData.title = res.title;
        // let categorydata = localStorage.getItem('Category-Object');
        // this.category = JSON.parse(categorydata);
        // this.checklistData.categoryId = this.category.categoryId; 
        this.checklistData.categoryId = this.categoryID;
        this.isEdited = true;
        this.formTitle = `Edit Checklist`;
        this.checklistData.checklistId = res.checklistId;
      }
    })
    this.getCategoryList();
    this.getDurationList();
  }

  getDurationList() {
    this.assetmateService.getDurationList().subscribe(res => {
      if (res.durationType) {
        this.durationList = res.durationType;
      }
    },
      error => {
        console.log(error);
      }
    );
  }

  /*********************************************************** Select Asset Category *******************************************************************/

  getCategoryList() {
    this.assetmateService.getCategoryList().subscribe(res => {
      if (res.AssetCategory) {
        this.categoryList = res.AssetCategory;
        for (let i = 0; i < this.categoryList.length; i++) {
          if (this.categoryID == this.categoryList[i].categoryId) {
            this.checklistData.categoryId = this.categoryList[i].categoryId;
          }
        }
      }

    },
      error => {
        console.log(error);

      })
  }

  /*********************************************************** Add New Checklist *******************************************************************/
  addChecklist(value) {
    value.categoryId = Number(this.route.snapshot.params['categoryId']);

    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.addChecklist(value).subscribe(res => {


      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.showFirst = !this.showFirst;
      this.assetmateService.setBadgeUpdateAction('assetList', true);

    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar('Something went wrong');
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /*********************************************************** Add New Checklist *******************************************************************/
  editChecklist(value) {

    this.assetmateService.editChecklist(this.checklistData.checklistId, value).subscribe(res => {
      console.log('edit checklist res', res);

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
        console.log("edit checklist error", error);
        this.toastr.error(error.message);
      })
  }




  /*********************************************************** Back to Asset List *******************************************************************/

  backToList() {
    let categorydata = localStorage.getItem('Category-Object');
    // this.category = JSON.parse(categorydata);
    // this.dataService.changeData(this.category);
    this.showFirst = !this.showFirst;
    // this.router.navigate(['/asset']);   

  }



} 
