import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-doc-viewer-dialog',
  templateUrl: './doc-viewer-dialog.component.html',
  styleUrls: ['./doc-viewer-dialog.component.css']
})
export class DocViewerDialogComponent implements OnInit {

  document = '';

  constructor(
    public dialogRef: MatDialogRef<DocViewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    console.log('DocViewerDialogComponent');

    this.document = 'https://docs.google.com/viewer?url=' + this.dialogData.docUrl + '&embedded=true';
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getDialogDocTitle() {
    return this.dialogData.docTitle.length > 25 ? (this.dialogData.docTitle.substring(0, 25) + ' ...') : this.dialogData.docTitle;
  }

}
