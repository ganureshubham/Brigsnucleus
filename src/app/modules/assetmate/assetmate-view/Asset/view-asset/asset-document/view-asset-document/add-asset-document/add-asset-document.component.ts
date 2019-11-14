import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { AssetmateService } from '../../../../../../service/assetmate.service';
import { DataSharingService } from '../../../../../../../../public service/data-sharing.service';
import { MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../../../../../../../public service/spinner.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-asset-document',
  templateUrl: './add-asset-document.component.html',
  styleUrls: ['./add-asset-document.component.css']
})
export class AddAssetDocumentComponent implements OnInit {

  showFirst: boolean = false;
  documentData: any = {};
  formTitle: string = "Add Document";
  isEdited: boolean = false;
  documenterror: any;
  documentList: any;
  filepath: any;
  fileToUpload1: File = null;
  category: any;
  AssetLists: any;
  assetId: number;

  constructor(
    private assetmateService: AssetmateService,
    private dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
  ) { }

 ngOnInit() {
   this.assetId = this.route.snapshot.params['assetId'];
   this.dataService.mSaveData.subscribe(res => {
     if (res != null && res != "null" && res != "null") {
       this.documentData = res;
       this.filepath = res.filepath.split('/').pop().split('?')[0];
       this.isEdited = true;
       this.formTitle = Edit Document;
     } else {
       //Hardcoded documentTypeIdFK for asset it is 2
       this.documentData.documentTypeIdFK = 2;
       this.documentData.masterId = Number(this.assetId);
     }
   })
   this.getDocumentList();
   this.getAssetLists();
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

  /*********************************************************** Get Asset List *******************************************************************/

  getAssetLists() {
    this.assetmateService.getAssetLists().subscribe(res => {

      if (res.assetList) {
        this.AssetLists = res.assetList;
      }
    },
      error => {
        console.log(error);

      }
    );
  }

  /*********************************************************** Add  Document file *****************************************************************/
  documentChange(files: FileList) {
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

    //Hardcoded documentTypeIdFK for asset it is 2
    value.documentTypeIdFK = 2;
    value.masterId = this.assetId;

    if (formData.valid) {
      this.uploadDocToserver((result1) => {
        value.filepath = result1;

        this.spinnerService.setSpinnerVisibility(true);

        this.assetmateService.addDocument(value).subscribe(
          res => {

            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);

            let categorydata = localStorage.getItem('Category-Object');
            this.category = JSON.parse(categorydata);
            this.dataService.changeData(this.category);
            this.showFirst = !this.showFirst;

            this.assetmateService.setBadgeUpdateAction('assetDetails', true);

          },
          error => {
              this.showSnackBar("Something went wrong..!!");
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
       value.documentTypeIdFK = this.documentData.documentTypeIdFK;
       value.masterId = this.documentData.masterId;
       this.spinnerService.setSpinnerVisibility(true);
       this.assetmateService.editDocument(this.documentData.documentId, value).subscribe(
         res => {
           this.spinnerService.setSpinnerVisibility(false);
           this.showSnackBar(res.message);
           let categorydata = localStorage.getItem('Category-Object');
           this.category = JSON.parse(categorydata);
           this.dataService.changeData(this.category);
           this.showFirst = !this.showFirst;
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


  /*********************************************************** Back to Asset List *******************************************************************/

  backToList() {
    let categorydata = localStorage.getItem('Category-Object');
    this.category = JSON.parse(categorydata);
    this.dataService.changeData(this.category);
    this.showFirst = !this.showFirst;
    // this.router.navigate(['/asset']);   

  }


} 
