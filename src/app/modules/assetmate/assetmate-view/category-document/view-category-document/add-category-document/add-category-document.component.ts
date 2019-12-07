import { Component, OnInit, Inject } from '@angular/core';
import { AssetmateService } from '../../../../service/assetmate.service';
import { DataSharingService } from '../../../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'
import { SpinnerService } from '../../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
  categoryId;

  constructor(
    private assetmateService: AssetmateService,
    private dataService: DataSharingService,
    private toastr: ToastrService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.categoryId = Number(this.data.categoryId);
    if (this.data.action == "add") {
      this.formTitle = "Add Document";
      this.isEdited = false;
      this.documentData.documentTypeIdFK = 2;
      this.documentData.masterId = this.categoryId;
    } else {
      this.formTitle = "Edit Document"
      this.isEdited = true;
      this.documentData = this.data.documentData;
      this.filepath = this.data.documentData.filepath.split('/').pop().split('?')[0];
    }
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

  onNoClick(): void {
    this.dialogRef.close({ action: false });
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
    var validDocumentFormats = ['pdf', 'PDF', 'DOCX', 'DOC', 'XLS', 'XLSX', 'docx', 'doc', 'gif', 'png', 'jpeg', 'jpg', 'xls', 'xlsx'];
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
        value.documentTypeIdFK = 1;
        value.masterId = Number(this.categoryId);
        this.spinnerService.setSpinnerVisibility(true);
        this.assetmateService.addDocument(value).subscribe(
          res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message)
            this.showFirst = !this.showFirst;
            this.assetmateService.setBadgeUpdateAction('assetList', true);
            this.dialogRef.close({ action: true });
          },
          error => {
            this.showSnackBar("Something went wrong..!!");
          }
        );
      })
    }
  }
  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
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
        value.documentTypeIdFK = 1;
        value.masterId = Number(this.categoryId);
        this.spinnerService.setSpinnerVisibility(true);
        this.assetmateService.editDocument(this.documentData.documentId, value).subscribe(
          res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.dialogRef.close({ action: true });
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
