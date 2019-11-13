import { Component, OnInit } from '@angular/core';
import { AssetmateService } from '../../../../service/assetmate.service';
import { DataSharingService } from '../../../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-category-document',
  templateUrl: './add-category-document.component.html',
  styleUrls: ['./add-category-document.component.css']
})
export class AddCategoryDocumentComponent implements OnInit {
  showFirst: boolean = false;
  documentData: any = {};
  formTitle: string = "Add Document";
  isEdited: boolean = false;
  documentList: any;
  categoryLists: any;
  documenterror: any;
  filepath: any;
  fileToUpload1: File = null;
  category: any;


  constructor(
    private assetmateService: AssetmateService,
    private dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.dataService.mSaveData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        console.log('doc edit res', res);
        this.documentData = res;
        this.filepath = res.filepath.split('/').pop().split('?')[0];


        this.isEdited = true;
        this.formTitle = `Edit Document`;
      }
    })
    this.getDocumentList();
    this.getcategoryLists();
  }
  /*********************************************************** Get Document List *******************************************************************/

  getDocumentList() {
    this.assetmateService.getDocumentList().subscribe(res => {
      if (res.documentType) {
        this.documentList = res.documentType;
      }
    },
      error => {
        console.log(error);
      }
    );
  }

  /*********************************************************** Get Category List *******************************************************************/

  getcategoryLists() {
    this.assetmateService.getcategoryLists().subscribe(res => {
      if (res.AssetCategory) {
        this.categoryLists = res.AssetCategory;
      }
    },
      error => {
        console.log(error);
      }
    );
  }

  /*********************************************************** Add  Document file *****************************************************************/
  documentChange(files: FileList) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 200);
    var validDocumentFormats = ['pdf', 'docx', 'doc'];
    var extension = files.item(0).name.split('.').pop();
    if (validDocumentFormats.includes(extension)) {
      this.documenterror = "";
      this.fileToUpload1 = files.item(0);
      let formData: FormData = new FormData();
      formData.append("file", this.fileToUpload1, this.fileToUpload1.name);
      this.filepath = files.item(0).name;
    } else {
      this.documenterror = "please select Documents only";
    }
  }

  /*********************************************************** Add New Asset *******************************************************************/

  addDocument(formData: NgForm) {
    let value = formData.value;
    if (formData.valid) {
      this.uploadDocToserver((result1) => {
        value.filepath = result1;
        // console.log(JSON.stringify(value));
        this.assetmateService.addDocument(value).subscribe(
          res => {
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
            this.toastr.error(error.message);
          }
        );
      })
    }
  }



  uploadDocToserver = (callback) => {
    if (this.fileToUpload1 == null) {
      callback(this.filepath)
    } else {
      let formData: FormData = new FormData();
      formData.append("file", this.fileToUpload1, this.fileToUpload1.name);
      this.assetmateService.docsUpload(formData).subscribe(res => {
        callback(res.DocumentName)
      })
    }
  }

  /*********************************************************** Edit Document *******************************************************************/

  editDocument(formData: NgForm) {
    let value = formData.value;
    if (formData.valid) {
      this.uploadDocToserver((result1) => {
        value.filepath = result1;
        // console.log(JSON.stringify(value));
        this.assetmateService.editDocument(this.documentData.documentId, value).subscribe(
          res => {
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
            this.toastr.error(error.message);
          }
        );
      })
    }

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
