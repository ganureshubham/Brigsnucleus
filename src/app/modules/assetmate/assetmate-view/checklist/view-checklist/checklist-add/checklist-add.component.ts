import { Component, OnInit, Inject } from '@angular/core';
import { AssetmateService } from '../../../../service/assetmate.service';
import { DataSharingService } from '../../../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../../../../public service/spinner.service';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-checklist-add',
  templateUrl: './checklist-add.component.html',
  styleUrls: ['./checklist-add.component.css']
})
export class ChecklistAddComponent implements OnInit {

  categoryList: any;
  checklistData: any = {};
  showFirst: boolean = false;
  formTitle: string = "Add Audit";
  category: any;
  isEdited: boolean = false;
  categoryID: any;
  durationList: any;
  cancelbtn = 0;

  constructor(private assetmateService: AssetmateService,
    private dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ChecklistAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit() {
    this.categoryID = Number(this.data.categoryid);
    if (this.data.type == 'Add') {
      this.checklistData.categoryId = this.categoryID;
    } else if (this.data.type == 'Edit') {
      this.checklistData = this.data.checklistdata;
      this.isEdited = true;
      this.formTitle = `Edit Audit`;
      this.checklistData.categoryId = this.categoryID;
    }
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
    value.categoryId = this.categoryID;
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.addChecklist(value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
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
    value.categoryId = this.categoryID;
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.editChecklist(this.checklistData.checklistId, value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }




  /*********************************************************** Back to Asset List *******************************************************************/

  backToList() {
    let categorydata = localStorage.getItem('Category-Object');
    this.showFirst = !this.showFirst;

  }



} 
