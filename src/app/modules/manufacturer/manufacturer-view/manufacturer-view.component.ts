import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { ManufacturerService } from '../service/manufacturer.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from '../../../public service/dialog.service';
import { SpinnerService } from '../../../public service/spinner.service';
import { AppDialogData } from '../../../model/appDialogData';

@Component({
  selector: 'app-manufacturer-view',
  templateUrl: './manufacturer-view.component.html',
  styleUrls: ['./manufacturer-view.component.css']
})
export class ManufacturerViewComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  manufacturerData: any = {};
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  isNoRecordFound: boolean = true;




  displayedColumns: string[] = ['title', 'Actions'];
  paidDataSource: MatTableDataSource<Manufacturer> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;
  manufacturerId: number;

  constructor(private http: HttpClient,
    private router: Router,
    private manufacturerService: ManufacturerService,
    public dataService: DataSharingService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getAllmanufacturers(this.pageNumber);
  }


  ngOnDestroy(): void { }


  /*********************************************************** Get All Roles *******************************************************************/

  getAllmanufacturers(pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.manufacturerService.getAllmanufacturers(pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.manufacturer) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.manufacturer;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }




  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllmanufacturers(this.page);
  }


  addManufacturer() {
    let selectedManufacturer = null;
    this.dataService.changeData(selectedManufacturer);
    this.router.navigate(['/manufacturer/add-manufacturer']);
  }

  /*********************************************************** Delete Particular Role *******************************************************************/




  deleteManufacturer(manufacturerId: number, title: string) {
    this.manufacturerId = manufacturerId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE MANUFACTURER',
      message: ` Are your sure you want to delete manufacturer "${title}"`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel"
    }
    this.dialogService.setDialogVisibility(appDialogData);
    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogService.getUserDialogAction().subscribe(userAction => {
        if (userAction == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (userAction == 1) {
          this.dialogService.setUserDialogAction(0);
          //User has approved delete operation
          this.spinnerService.setSpinnerVisibility(true);
          this.manufacturerService.deletemanufacturer(this.manufacturerId).subscribe(res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.getAllmanufacturers(this.page);
          }, error => {
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }
  }

  /*********************************************************** Edit Particular Asset  *******************************************************************/

  editManufacturer(manufacturerId: number) {
    this.dataService.changeData(manufacturerId);
    this.router.navigate(['/manufacturer/add-manufacturer']);
  }


}

export interface Manufacturer {
  manufacturerId: number;
  title: string;
}

