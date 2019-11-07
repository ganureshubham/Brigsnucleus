import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetService } from '../../service/asset.service';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.css']
})
export class AddAssetComponent implements OnInit {
  assetData: any = {}
  fileToUpload: File = null;
  fileToUpload1: File = null;
  locationList: any;
  deptList: any;
  durationList: any;
  isEdited: boolean = false; 
  manufList: any;
  suppList: any;
  photoPath: any;
  categoryList: any;
  assetImage: any;
  userGuideBook: any;
  imageerror: any;
  pdferror: any;
  formTitle: string = "Add Asset";
  showFirst:boolean=false;



  constructor(private router: Router,
    private assetService: AssetService,
    private dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService 
  ) { }

  ngOnInit() {
    this.dataService.currentData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        console.log("ngonit function", res);

        this.isEdited = true;
        this.formTitle = `Edit Asset`;

        this.getDetails(res);

      }
    })
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
    this.assetService.getDetails(assetId).subscribe(res => {
      if (res.asset) {
        this.assetData = res.asset;
        let installationDate = new Date(this.assetData.installationDate);
        this.assetData.installationDate = installationDate;
        this.assetImage = res.asset.image.split('/').pop().split('?')[0];
        this.userGuideBook = res.asset.userGuideBook.split('/').pop().split('?')[0];
      }
    },
      error => {
        console.log(error);
        this.toastr.error(error.message);
      })
  }

  /*********************************************************** Get Installation Location List *******************************************************************/

  getLocationList() {
    this.assetService.getLocationList().subscribe(res => {
      if (res.installationLocationType) {
        this.locationList = res.installationLocationType;
      }
    },
      error => {
        console.log(error);

      })

  }

  /*********************************************************** Get Department List *******************************************************************/

  getDeptList() {
    this.assetService.getDeptList().subscribe(res => {
      if (res.department) {
        this.deptList = res.department;
      }
    },
      error => {
        console.log(error);
        this.toastr.error(error.message);

      }
    );
  }

  /*********************************************************** Add New Asset *******************************************************************/

  addAsset(formData: NgForm) {
    let value = formData.value;
    value.installationDate = moment(value.installationDate).format("YYYY/MM/DD");
    if (formData.valid) {
      this.uploadImageToserver((result) => {
        value.image = result;
        this.uploadPdfToserver((result1) => {
          value.userGuideBook = result1;
          console.log(JSON.stringify(value));

          this.assetService.addAsset(value).subscribe(
            res => {
              this.spinner.show();
              setTimeout(() => {
                this.toastr.success(res.message);
                this.router.navigate(['/asset']);
                this.spinner.hide();
              }, 1000);
           
            },
            error => {
              console.log(error);
              this.toastr.error(error.message);

            }
          );
        })
      })
    }
  }


  uploadImageToserver = (callback) => {
    if (this.fileToUpload == null) {
      callback(this.assetImage)
    } else {
      let formData: FormData = new FormData();
      formData.append("file", this.fileToUpload, this.fileToUpload.name);
      this.assetService.photoUpload(formData).subscribe(res => {
        console.log(res);
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
      this.assetService.docUpload(formData).subscribe(res => {
        console.log(res);
        callback(res.DocumentName)
      })
    }
  }

  /*********************************************************** Edit Selected Asset *******************************************************************/
  // on submit of update button send updated data on server 
  editAsset(formData: NgForm) {
    let value = formData.value;
    value.installationDate = moment(value.installationDate).format("YYYY/MM/DD");
    if (formData.valid) {
      this.uploadImageToserver((result) => {
        value.image = result;
        this.uploadPdfToserver((result1) => {
          value.userGuideBook = result1;
          this.assetService.editAsset(this.assetData.assetId, value).subscribe(
            res => {
              this.spinner.show();
              setTimeout(() => {
                this.toastr.success(res.message);
                this.router.navigate(['/asset']);
                this.spinner.hide();
              }, 1000);
            
            },
            error => {
              console.log(error);
              this.toastr.error(error.message);
            }
          );
        })
      })
    }

    //

    // console.log("edit function",value);
    // if (this.fileToUpload && this.fileToUpload.name) {
    //   let formData: FormData = new FormData();
    //   formData.append("file", this.fileToUpload, this.fileToUpload.name);
    //   this.assetService.photoUpload(formData).subscribe(res => {

    //     var mImageName=res.image.split('/').pop().split('?')[0] ;
    //     //console.log(mImageName);
    //     value.image =mImageName
    //     value.userGuideBook = this.assetData.userGuideBook;
    //     this.assetService.editAsset(this.assetData.assetId, value).subscribe(res => {
    //       //console.log(res.asset.image);
    //       this.router.navigate(['/asset']);
    //     },
    //       error => {
    //         console.log(error);
    //       })
    //   },
    //     error => {
    //       console.log(error);
    //     })
    // } else {
    //   console.log("edit else",value);
    //   value.image = this.assetData.image;
    //   value.userGuideBook = this.assetData.userGuideBook;
    //   this.assetService.editAsset(this.assetData.assetId, value).subscribe(res => {
    //     //console.log(res);
    //     this.router.navigate(['/asset']);
    //   },
    //     error => {
    //       console.log(error);
    //     })
    // }
  }

  /*********************************************************** Add Asset Photo *****************************************************************/
  imageChange(files: FileList) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    var validImageFormats = ['jpg', 'gif', 'PNG', 'JPEG', 'png', 'jpeg', 'JPG'];
    var extension = files.item(0).name.split('.').pop();
    if (validImageFormats.includes(extension)) {
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
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    var validImageFormats = ['pdf', 'docx', 'doc'];
    var extension = files.item(0).name.split('.').pop();
    if (validImageFormats.includes(extension)) {
      this.pdferror="";
      this.fileToUpload1 = files.item(0);
      let formData: FormData = new FormData();
      formData.append("file", this.fileToUpload1, this.fileToUpload1.name);
      this.userGuideBook = files.item(0).name;
    } else {
      this.pdferror = "please select Document only";
      console.log(this.pdferror);
      
    }
  }

  /*********************************************************** Get Duration List for checking *******************************************************************/

  get_c_DurationList() {
    this.assetService.getDurationList().subscribe(res => {
      if (res.durationType) {
        this.durationList = res.durationType;
      }
    },
      error => {
        console.log(error);


      }
    );
  }

  /*********************************************************** Get Duration List for Warrenty *******************************************************************/

  get_w_DurationList() {
    this.assetService.getDurationList().subscribe(res => {
      if (res.durationType) {
        this.durationList = res.durationType;
      }
    },
      error => {
        console.log(error);


      }
    );
  }

  /*********************************************************** Get Manufacturer List *******************************************************************/

  getManufList() {
    this.assetService.getManufList().subscribe(res => {
      if (res.manufacturerList) {
        this.manufList = res.manufacturerList;
      }
    },
      error => {
        console.log(error);


      }
    );

  }

  /*********************************************************** Get Manufacturer List *******************************************************************/

  getsuppList() {
    this.assetService.getsuppList().subscribe(res => {
      if (res.supplierList) {
        this.suppList = res.supplierList;
      }
    },
      error => {
        console.log(error);


      }
    );

  }

  /*********************************************************** Get Category List *******************************************************************/

  getcategoryList() {
    this.assetService.getcategoryList().subscribe(res => {
      if (res.AssetCategory) {
        this.categoryList = res.AssetCategory;
      }
    },
      error => {
        console.log(error);


      }
    );

  }


  backToList() {
    this.showFirst=!this.showFirst;
    // this.router.navigate(['/asset']);
    
  }



}
