import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AssetCategoryService } from '../../service/asset-category.service';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpinnerService } from '../../../../public service/spinner.service';

@Component({
  selector: 'app-add-asset-category',
  templateUrl: './add-asset-category.component.html',
  styleUrls: ['./add-asset-category.component.css']
})
export class AddAssetCategoryComponent implements OnInit {

  AssetCategoryData: any = {}
  assetcategList: any;
  formTitle: string = "Add Asset Category";
  isEdited: boolean = false;
  savebtn = 1;
  cancelbtn = 0;






  constructor(private router: Router,
    private assetCategoryService: AssetCategoryService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddAssetCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    if (this.data.type == 'Add') {
      if (this.data.level > 0) {
        this.AssetCategoryData.parentId = this.data.categoryId;
      } else {
        this.AssetCategoryData.parentId = this.data.parentId;
      }
    } else if (this.data.type == 'Edit') {
      this.isEdited = true;
      this.formTitle = `Edit Asset Category`;
      this.AssetCategoryData = this.data;
    } else if (this.data.type == 'New Add') {
      this.AssetCategoryData.parentId = this.data.parentId;
    }
    this.getCategoryList();
  }

  /*********************************************************** Get Asset category List *******************************************************************/


  getCategoryList() {
    this.assetCategoryService.getCategoryList().subscribe(res => {
      if (res.AssetCategory) {
        this.assetcategList = res.AssetCategory;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })

  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /*********************************************************** Add New Department *******************************************************************/


  addAssetCategory(value) {
    value.parentId = this.AssetCategoryData.parentId;
    this.spinnerService.setSpinnerVisibility(true);
    this.assetCategoryService.addAssetCategory(value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })

  }

  /*********************************************************** Update particular Department *******************************************************************/

  editAssetCategory(value) {
    value.parentId = this.AssetCategoryData.parentId;
    this.spinnerService.setSpinnerVisibility(true);
    this.assetCategoryService.editAssetCategory(this.AssetCategoryData.categoryId, value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })

  }


  // backToList(){
  //   this.router.navigate(['/asset-category']);
  // }

  // addAsset(){} 

}
