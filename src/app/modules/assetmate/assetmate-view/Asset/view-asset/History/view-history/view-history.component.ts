import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../../../../../service/assetmate.service';
import { SpinnerService } from '../../../../../../../public service/spinner.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.css']
})
export class ViewHistoryComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  roleData: any = {};
  showFirst: boolean = false;
  isNoRecordFound: boolean = true;


  displayedColumns: string[] = ['checkListTitle', 'doneBy', 'doneOn', 'Actions'];
  // 'doneChecklistId', 
  paidDataSource: MatTableDataSource<Role> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;
  AssetId: any;

  constructor(private http: HttpClient,
    private router: Router,
    private assetmateService: AssetmateService,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,

  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    // this.dataService.mSaveData.subscribe(res => {
    //   if (res != null && res != "null" && res != "null") { 
    //     this.AssetId=res;
    this.AssetId = this.route.snapshot.params['assetId'];
    this.getAssetHistory(this.AssetId, this.pageNumber);
    //   }
    // })

  }


  ngOnDestroy(): void { }


  /*********************************************************** Get All Roles *******************************************************************/


  getAssetHistory(assetIdFK: number, pageNo: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.doneChecklistLists(assetIdFK, pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.assetHistory) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.assetHistory;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message)
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }



  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAssetHistory(this.AssetId, this.page);
  }




  /*********************************************************** Edit Particular Asset  *******************************************************************/

  viewQuestion(doneChecklistId: number) {
    this.dataService.saveData(doneChecklistId);
    this.showFirst = !this.showFirst;
    //this.router.navigate(['/assetmate/view-question']); 

  }

  saveAuditAsPDF(audit) {

    this.spinnerService.setSpinnerVisibility(true);

    //Get All question and answers of audit
    //Save Audit question answers as pdf
    this.assetmateService.getQuestAnsListForPDF(audit.doneChecklistId).subscribe((resp: any) => {

      console.log('Resp[onse', resp);

      var doc = new jsPDF("p", "mm", "a4");
      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();

      doc.rect(5, 5, width - 10, height - 10, 'S');

      let currentYAxisPosition = 20;
      let currentXAxisPosition = 15;
      let yAxisAlias10 = 10;
      let yAxisAlias5 = 5;
      let yAxisAlias12 = 12;
      let yAxisAlias15 = 15;
      let srNo = 1;
      let lines;
      let srNoXAxisAlias = 14;
      let imageDimension = 40;

      doc.setFontType("bold");
      doc.setFontSize(14);

      let title = 'AUDIT';
      let txtWidth = doc.getStringUnitWidth(title) * 14 / doc.internal.scaleFactor;
      let xOffset = (width - txtWidth) / 2;
      doc.text(title, xOffset, currentYAxisPosition);
      currentYAxisPosition += yAxisAlias10;

      doc.setFontSize(12);
      doc.text(currentXAxisPosition, currentYAxisPosition, 'Asset Name : ' + resp.questionAnswer[0].assetTitle);
      currentYAxisPosition += yAxisAlias10;

      doc.text(currentXAxisPosition, currentYAxisPosition, 'Audit Title : ' + resp.questionAnswer[0].auditTitle);
      currentYAxisPosition += yAxisAlias15;

      doc.setFontType("normal");
      doc.setFontSize(12);

      //Test print on multiple page and wrapping of text.
      /* let a = resp.questionAnswer;
      for (let index = 0; index < 7; index++) {
        resp.questionAnswer.push(...a);
      } */

      for (let questionAnswer of resp.questionAnswer) {

        //Add New Page
        if (currentYAxisPosition >= (height - 30)) {
          doc.addPage();
          doc.rect(5, 5, width - 10, height - 10, 'S');
          currentYAxisPosition = 20;
        }

        doc.text(currentXAxisPosition, currentYAxisPosition, srNo + '. ');
        lines = doc.splitTextToSize(questionAnswer.question, width - 40)
        doc.text(currentXAxisPosition + srNoXAxisAlias, currentYAxisPosition, lines);
        currentYAxisPosition += (doc.getTextDimensions(lines).h + 1.5);

        if (questionAnswer.checklistImage == null) {

          //Add New Page
          if (currentYAxisPosition >= (height - 30)) {
            doc.addPage();
            doc.rect(5, 5, width - 10, height - 10, 'S');
            currentYAxisPosition = 20;
          }

          doc.text(currentXAxisPosition, currentYAxisPosition, 'Ans : ');
          lines = doc.splitTextToSize(questionAnswer.answer, width - 40)
          doc.text(currentXAxisPosition + srNoXAxisAlias, currentYAxisPosition, lines);
          currentYAxisPosition += ((doc.getTextDimensions(lines).h + 1.5) + yAxisAlias5);

        } else {

          let img: any = document.getElementById("imageid");
          img.src = questionAnswer.checklistImage;

          //Add New Page - For image height mapped to less height (height - 50)
          if (currentYAxisPosition >= (height - 50)) {
            doc.addPage();
            doc.rect(5, 5, width - 10, height - 10, 'S');
            currentYAxisPosition = 20;
          }

          doc.addImage(this.getBase64Image(document.getElementById("imageid")), '*', ((width / 2) - (imageDimension / 2)), currentYAxisPosition, imageDimension, imageDimension);
          currentYAxisPosition += imageDimension + yAxisAlias15;

        }

        srNo++;

      }

      this.spinnerService.setSpinnerVisibility(false);
      doc.save('Audit - ' + resp.questionAnswer[0].auditTitle.substring(0, 20) + '__.pdf');

    });

  }

  getBase64Image(img) {
    let canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    let dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }


}

export interface Role {
  doneChecklistId: number;
  checkListTitle: string;
  doneBy: string;
  doneOn: string;
}
