import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { DataSharingService } from '../../../../../../public service/data-sharing.service';
import { AssetmateService } from '../../../../service/assetmate.service';
import { SpinnerService } from '../../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-asset-add',
  templateUrl: './asset-add.component.html',
  styleUrls: ['./asset-add.component.css']
})
export class AssetAddComponent implements OnInit {
  assetData: any = {}
  fileToUpload: File = null;
  fileToUpload1: File = null;
  locationList: any;
  deptList: any;
  durationList: any;
  manufList: any;
  suppList: any;
  photoPath: any;
  categoryList: any;
  assetImage: any;
  userGuideBook: any;
  imageerror: any;
  pdferror: any;
  formTitle: string = "Add Asset";
  isEdited: boolean = false;
  showFirst: boolean = false;
  category: any;
  selectedCategory: any;
  todaydate: Date = new Date();
  categoryID;

  constructor(private router: Router,
    private assetmateService: AssetmateService,
    private dataService: DataSharingService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close({ action: false });
  }

  ngOnInit() {

    this.categoryID = this.data.categoryId;

    if (this.data.action == "add") {
      this.formTitle = "Add Asset";
      this.isEdited = false;
    } else {
      this.formTitle = "Edit Asset"
      this.getDetails(this.data.assetId)
      this.isEdited = true;
    }

    this.getLocationList();
    this.getDeptList();
    this.get_c_DurationList();
    this.get_w_DurationList();
    this.getManufList();
    this.getsuppList();
    this.getcategoryList();

  }

  /*********************************************************** Get Installation Location List *******************************************************************/

  getDetails(assetId) {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getDetails(assetId).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.asset) {
        this.assetData = res.asset;
        if (res.asset.companyAssetNo == "undefined") {
          this.assetData.companyAssetNo = "";
        }
        let installationDate = new Date(this.assetData.installationDate);
        this.assetData.installationDate = installationDate;
        this.assetImage = res.asset.image.split('/').pop().split('?')[0];
        this.userGuideBook = res.asset.userGuideBook.split('/').pop().split('?')[0];
      } else {
        this.showSnackBar(res.message);
      }

    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

  /*********************************************************** Get Installation Location List *******************************************************************/

  getLocationList() {
    this.assetmateService.getLocationList().subscribe(res => {
      if (res.installationLocationType) {
        this.locationList = res.installationLocationType;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })
  }

  /*********************************************************** Get Department List *******************************************************************/

  getDeptList() {
    this.assetmateService.getDeptList().subscribe(res => {
      if (res.department) {
        this.deptList = res.department;
      }
    },
      error => {
        console.log(error);
        this.showSnackBar("Something went wrong..!!");

      }
    );
  }

  /*********************************************************** Add New Asset *******************************************************************/

  addAsset(formData: any) {
    if (formData.value.description == undefined) {
      formData.value.description = "";
    }
    let value = formData.value;
    value.categoryIdFK = Number(this.data.categoryId);
    value.installationDate = moment(value.installationDate).format("YYYY/MM/DD");
    if (formData.valid) {
      this.spinnerService.setSpinnerVisibility(true);
      this.uploadImageToserver((result) => {
        value.image = result;
        this.uploadPdfToserver((result1) => {
          value.userGuideBook = result1;
          this.assetmateService.addAsset(value).subscribe(res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            if (res.status) {
              this.assetmateService.setBadgeUpdateAction('assetList', true);
              this.dialogRef.close({ action: true });
            }
          },
            error => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar("Something went wrong..!!");
            }
          );
        })
      })
    }
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  uploadImageToserver = (callback) => {
    if (this.fileToUpload == null) {
      callback(this.assetImage)
    } else {
      let formData: FormData = new FormData();
      formData.append("file", this.fileToUpload, this.fileToUpload.name);
      this.assetmateService.photoUpload(formData).subscribe(res => {
        callback(res.ImageName)
      })
    }
  }

  uploadPdfToserver = (callback) => {
    if (this.fileToUpload1 == null) {
      callback(this.userGuideBook)
    } else {
      let formData: FormData = new FormData();
      formData.append("file", this.fileToUpload1, this.fileToUpload1.name);
      this.assetmateService.docUpload(formData).subscribe(res => {
        callback(res.DocumentName)
      })
    }
  }

  /*********************************************************** Edit Selected Asset *******************************************************************/
  // on submit of update button send updated data on server 
  editAsset(formData: NgForm) {
    if (formData.value.description == undefined) {
      formData.value.description = "";
    }
    let value = formData.value;
    // value.categoryIdFK = this.route.snapshot.params['categoryId'];
    value.installationDate = moment(value.installationDate).format("YYYY/MM/DD");
    if (formData.valid) {
      this.spinnerService.setSpinnerVisibility(true);
      this.uploadImageToserver((result) => {
        value.image = result;
        this.uploadPdfToserver((result1) => {
          value.userGuideBook = result1;
          this.assetmateService.editAsset(this.assetData.assetId, value).subscribe(
            res => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar(res.message);
              if (res.status) {
                // let categorydata = localStorage.getItem('Category-Object');
                // this.category = JSON.parse(categorydata);
                this.dataService.changeData(this.category);
                this.dialogRef.close({ action: true });
              }
            },
            error => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar("Something went wrong..!!");
            }
          );
        })
      })
    }
  }

  /*********************************************************** Add Asset Photo *****************************************************************/
  imageChange(files: FileList) {
    var validImageFormats = ['jpg', 'gif', 'GIF', 'PNG', 'JPEG', 'png', 'jpeg', 'JPG'];
    var extension = files.item(0).name.split('.').pop();
    if (validImageFormats.includes(extension)) {
      this.imageerror = "";
      let formData: FormData = new FormData();
      this.fileToUpload = files.item(0);
      formData.append("file", this.fileToUpload, this.fileToUpload.name);
      this.assetImage = files.item(0).name;
    } else {
      this.imageerror = "please select image only";
    }
  }


  /*********************************************************** Add User Guide Book *****************************************************************/
  pdfChange(files: FileList) {
    var validImageFormats = ['pdf', 'DOCX', 'DOC', 'XLS', 'XLSX', 'docx', 'doc', 'xls', 'xlsx'];
    var extension = files.item(0).name.split('.').pop();
    if (validImageFormats.includes(extension)) {
      this.pdferror = "";
      this.fileToUpload1 = files.item(0);
      let formData: FormData = new FormData();
      formData.append("file", this.fileToUpload1, this.fileToUpload1.name);
      this.userGuideBook = files.item(0).name;
    } else {
      this.pdferror = "please select Documents only";
    }
  }

  /*********************************************************** Get Duration List for checking *******************************************************************/

  get_c_DurationList() {
    this.assetmateService.getDurationList().subscribe(res => {
      if (res.durationType) {
        this.durationList = res.durationType;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  /*********************************************************** Get Duration List for Warrenty *******************************************************************/

  get_w_DurationList() {
    this.assetmateService.getDurationList().subscribe(res => {
      if (res.durationType) {
        this.durationList = res.durationType;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  /*********************************************************** Get Manufacturer List *******************************************************************/

  getManufList() {
    this.assetmateService.getManufList().subscribe(res => {
      if (res.manufacturerList) {
        this.manufList = res.manufacturerList;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      }
    );

  }

  /*********************************************************** Get Manufacturer List *******************************************************************/

  getsuppList() {
    this.assetmateService.getsuppList().subscribe(res => {
      if (res.supplierList) {
        this.suppList = res.supplierList;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  /*********************************************************** Get Category List *******************************************************************/

  getcategoryList() {
    this.assetmateService.getcategoryList().subscribe(res => {
      if (res.AssetCategory) {
        this.categoryList = res.AssetCategory;
        for (let i = 0; i < this.categoryList.length; i++) {
          if (this.categoryID == this.categoryList[i].categoryId) {
            this.assetData.categoryIdFK = this.categoryList[i].categoryId;
          }
        }
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  /*********************************************************** Back to Asset List *******************************************************************/

  backToList() {
    this.showFirst = !this.showFirst;

  }



}
