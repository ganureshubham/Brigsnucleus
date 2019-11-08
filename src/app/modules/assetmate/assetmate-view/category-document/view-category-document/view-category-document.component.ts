import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetmateService } from '../../../service/assetmate.service';
import { DataSharingService } from '../../../../../public service/data-sharing.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-category-document',
  templateUrl: './view-category-document.component.html',
  styleUrls: ['./view-category-document.component.css']
})
export class ViewCategoryDocumentComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  assetData: any = {};
  showFirst: boolean = false;
  Router: any;
  categoryID: any;
  codeData: any;
  parentdata: any;
  result: string = '';


  displayedColumns: string[] = ['documentId', 'title', 'description', 'Actions'];
  dataSource: MatTableDataSource<Document> = new MatTableDataSource();

  //@ViewChild('paidPaginator') paidPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  animal: any;
  filepath: any;
  filedata: any = {};




  constructor(private http: HttpClient,
    private assetmateService: AssetmateService,
    private router: Router,
    private route: ActivatedRoute,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {

    this.categoryID = this.route.snapshot.params['categoryId'];

    // this.dataService.currentData.subscribe(res => {
    //   if (res != null && res != "null" && res != "null") {
    //     this.categoryID = res.categoryId;
    //     this.getAllDocuments(this.categoryID, this.pageNumber);
    //   } else {
    //     let categorydata = localStorage.getItem('Category-Object');
    //     let category = JSON.parse(categorydata);
    //     console.log('res from local storage Asset',category);

    //     this.getAllDocuments(category.categoryId, this.pageNumber);
    //     this.categoryID=category.categoryId; 
    //   }
    // })

    this.getAllDocuments(this.categoryID, this.pageNumber);
  }

  ngOnDestroy(): void { }

  /*********************************************************** Get All Assets *******************************************************************/

  getAllDocuments(categoryId, pageNo: any) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.assetmateService.getAllDocuments(categoryId, pageNo).subscribe(res => {
      console.log(res);

      this.dataSource = res.categoryDocument;
      this.pageNumber = res.currentPage;
      this.totalCount = res.totalCount;
    },
      error => {
        this.toastr.error(error.error.message);
      }
    );
  }


  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllDocuments(this.categoryID, this.page);
  }




  /*********************************************************** Go to Add Asset Form *******************************************************************/
  addAsset() {
    this.showFirst = !this.showFirst;
    let selectedAsset = null;
    this.dataService.saveData(selectedAsset);
    // this.router.navigate(['/asset/add-asset'])
  }



  /*********************************************************** Delete Particular Asset *******************************************************************/
  deleteDocument(documentId: number) {
    alert('are you sure?');
    this.assetmateService.deleteDocument(documentId).subscribe(res => {
      this.toastr.success(res.message);
      this.getAllDocuments(this.categoryID, this.page);
    })
    error => {
      this.toastr.error(error.message);
    }
  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/
  editDocument(visit: number) {
    this.showFirst = !this.showFirst;
    this.dataService.saveData(visit);
  }

  /*********************************************************** Download Particular Document  *******************************************************************/


  downloadDocument(file) {
    console.log(file);
    // var FileSaver = require('file-saver');
    const Ext = file.split('/').pop().split('?')[0]; // splits url into file name
    var ext = Ext.substr(Ext.lastIndexOf('.') + 1); // gives extension of any file name
    saveAs(file, Ext);

  }


  /*********************************************************** Search Document *******************************************************************/



  searchDocument(keyword) {
    if (keyword) {
      this.assetmateService.searchDocument(keyword).subscribe(res => {
        this.dataSource = res.data;
      }, error => {
        console.log(error);
      })

    } else {
      this.getAllDocuments(this.categoryID, this.pageNumber);
    }
  }


  // viewAsset = (assetId: number) => {
  //   this.dataService.changeData(assetId);
  //   this.router.navigate(['/asset/asset-details']);
  // }



}

export interface Document {
  documentId: number;
  title: string;
  description: string;
}
