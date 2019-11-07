import { Component, OnInit } from '@angular/core';
import { AssetmateService } from '../../../../service/assetmate.service';
import { DataSharingService } from '../../../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

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


  constructor(private assetmateService: AssetmateService,
    private dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }


  ngOnInit() {
    this.dataService.mSaveData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        this.checklistData.title=res.title;
        let categorydata = localStorage.getItem('Category-Object');
        this.category = JSON.parse(categorydata);
        this.checklistData.categoryId = this.category.categoryId; 
        this.isEdited = true;
        this.formTitle = `Edit Checklist`;
        this.checklistData.checklistId = res.checklistId;
      }
    })
    this.getCategoryList();
  }


  /*********************************************************** Select Asset Category *******************************************************************/

  getCategoryList() {
    this.assetmateService.getCategoryList().subscribe(res => {
      if (res.AssetCategory) {
        this.categoryList = res.AssetCategory;
      }

    },
      error => {
        console.log(error);

      })
  }

  /*********************************************************** Add New Checklist *******************************************************************/
  addChecklist(value) {
    this.assetmateService.addChecklist(value).subscribe(res => {
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
        this.toastr.error(error.message);
      })
  }

  /*********************************************************** Add New Checklist *******************************************************************/
  editChecklist(value) {
    
    this.assetmateService.editChecklist(this.checklistData.checklistId, value).subscribe(res => {
      console.log('edit checklist res',res);
      
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
        console.log("edit checklist error",error);
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
