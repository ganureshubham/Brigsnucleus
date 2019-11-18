import { Component, OnInit } from '@angular/core';
import { DocumateService } from '../../service/documate.service';
import { SpinnerService } from '../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataSharingService } from '../../../../public service/data-sharing.service';

@Component({
  selector: 'app-add-documate',
  templateUrl: './add-documate.component.html',
  styleUrls: ['./add-documate.component.css']
})
export class AddDocumateComponent implements OnInit {

  documentData: any = {};
  formTitle: string = "Add Document";
  documatetypelist: any;
  documenterror: any;
  filepath: any;
  fileToUpload1: File = null;
  isEdited: boolean;


  constructor(
    private documateService: DocumateService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dataService: DataSharingService,
  ) { }

  ngOnInit() {
    this.dataService.currentData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        console.log(" Documate ngonit function", res);
        this.documentData = res;
        this.filepath = res.filepath.split('/').pop().split('?')[0];
        this.isEdited = true;
        this.formTitle = `Edit Documate`;

      } else {
        this.documentData.documentTypeIdFK = 3;
      }
    })
    this.selectDocumentType();
  }

  /*********************************************************** Select Document type *****************************************************************/

  selectDocumentType() {
    this.documateService.selectDocumentType().subscribe(res => {
      console.log('documate select', res);
      if (res.documentType) {
        this.documatetypelist = res.documentType;
      }
    },
      error => {
        console.log(error);

      })
  }




  /*********************************************************** Add New Documate *******************************************************************/

  addDocument(formData: NgForm) {
    let value = formData.value;
    if (formData.valid) {
      this.uploadDocToserver((result1) => {
        value.filepath = result1;
        // console.log(JSON.stringify(value));
        this.spinnerService.setSpinnerVisibility(true);

        this.documateService.addDocumate(value).subscribe(
          res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.router.navigate(['/documate']);
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
      this.documateService.docUpload(formData).subscribe(res => {
        callback(res.DocumentName)
      })
    }
  }

  /*********************************************************** Edit Document *******************************************************************/

  editDocumate(formData: NgForm) {
    let value = formData.value;
    if (formData.valid) {
      this.uploadDocToserver((result1) => {
        value.filepath = result1;
        // console.log(JSON.stringify(value));
        this.spinnerService.setSpinnerVisibility(true);

        this.documateService.editDocumate(this.documentData.documentId, value).subscribe(
          res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.router.navigate(['/documate']);
          },
          error => {
            this.showSnackBar("Something went wrong..!!");
          }
        );
      })
    }
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



  backToList() {
    this.router.navigate(['/documate']);
  }



} 
