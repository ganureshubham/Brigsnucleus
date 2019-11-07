import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../../../../../../service/assetmate.service';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.css']
})
export class ViewQuestionComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  roleData: any = {};
  showFirst:boolean=false;



  displayedColumns: string[] = ['questionIdFK', 'questionType','answer','isDanger']; 
  paidDataSource: MatTableDataSource<Role> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;
  checklistId: any;

  constructor(private http: HttpClient,
    private router: Router,
    private assetmateService:AssetmateService,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.dataService.mSaveData.subscribe(res => {
      if (res != null && res != "null" && res != "null") { 
        console.log('donechecklistid',res);
        this.checklistId=res;
        this.getQuestAnsList(this.checklistId,this.pageNumber);
        
       // this.AssetId=res;
       // this.getAssetHistory(this.AssetId,this.pageNumber);
      }
    })
    
  }


  ngOnDestroy(): void { }


  /*********************************************************** Get All Roles *******************************************************************/



  getQuestAnsList(doneChecklistIdFK:number,pageNo: any) {
    // this.spinner.show();
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 1000);
    this.assetmateService.getQuestAnsList(doneChecklistIdFK,pageNo).subscribe(res => { 
      this.paidDataSource = res.questionAnswer;
      this.pageNumber = res.currentPage;
      this.totalCount = res.totalCount;


    },
      error => {
        this.toastr.error(error.error.message);
        console.log(error);
      }
    )
  }


  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getQuestAnsList(this.checklistId,this.page); 
  }


  
 
  /*********************************************************** Edit Particular Asset  *******************************************************************/

  viewQuestion(doneChecklistId: number) {
    this.dataService.changeData(doneChecklistId);
    this.router.navigate(['/assetmate/view-question']); 

  }


}

export interface Role {
  questionIdFK: number;
  questionType: string;
  answer: string;
  isDanger: string;
}
