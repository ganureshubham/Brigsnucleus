import { Component, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DataSharingService } from 'src/app/public service/data-sharing.service';
import { ManufacturerService } from '../service/manufacturer.service';
import { DialogService } from '../../../public service/dialog.service';
import { SpinnerService } from '../../../public service/spinner.service';
import { AppDialogData } from '../../../model/appDialogData';
import { AddManufacturerComponent } from './add-manufacturer/add-manufacturer.component';

interface manufacturerDialogData {
  type: string;
  manufacturerId: number;
  title: string;
}

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
  isNoRecordFound: boolean = false;

  displayedColumns: string[] = ['title', 'Actions'];
  paidDataSource: MatTableDataSource<Manufacturer> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;
  manufacturerId: number;
  dialogData: manufacturerDialogData;
  dialogServiceSubscription: Subscription;

  constructor(
    private manufacturerService: ManufacturerService,
    public dataService: DataSharingService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    public dialog: MatDialog
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

  ngOnDestroy() {
    this.dialogServiceSubscription.unsubscribe();
  }
  /*********************************************************** Get All Manufacturers *******************************************************************/

  getAllmanufacturers(pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.manufacturerService.getAllmanufacturers(pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
          this.showSnackBar(res.message, 2000);
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.manufacturer;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message, 2000);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!", 2000);
      })
  }

  showSnackBar(message: string, duration: any) {
    this.snackBar.open(message, '', { duration: duration });
  }

  /*********************************************************** Page Change *******************************************************************/

  pageChange(pageNo: any) {
    this.loading = true;
    this.page = pageNo.pageIndex;
    this.getAllmanufacturers(this.page);
  }

  /*********************************************************** Add Manufacturer *******************************************************************/

  addManufacturer() {
    this.dialogData = {
      type: 'Add',
      manufacturerId: 0,
      title: '',
    }

    const dialogRef = this.dialog.open(AddManufacturerComponent, {
      data: this.dialogData,
      width: '450px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllmanufacturers(this.pageNumber);
      }
    })
  }

  /*********************************************************** Delete Particular Manufacturer *******************************************************************/

  deleteManufacturer(manufacturerId: number, title: string) {
    this.manufacturerId = manufacturerId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE MANUFACTURER',
      message: ` Are your sure you want to delete manufacturer "${title}"`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel",
      action: 'manufacturer'
    }
    this.dialogService.setDialogVisibility(appDialogData);
    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogServiceSubscription = this.dialogService.getUserDialogAction().subscribe((resp: any) => {
        if (resp.result == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (resp.result == 1) {
          if (resp.action == 'manufacturer') {
            this.dialogService.setUserDialogAction(0);
            //User has approved delete operation
            this.spinnerService.setSpinnerVisibility(true);
            this.manufacturerService.deletemanufacturer(this.manufacturerId).subscribe(res => {
              this.spinnerService.setSpinnerVisibility(false);
              if (res.status) {
                this.showSnackBar(res.message, 4000);
                this.getAllmanufacturers(this.page);
              } else {
                this.showSnackBar(res.message, 4000);
              }
            }, error => {
              this.spinnerService.setSpinnerVisibility(false);
              this.showSnackBar("Something went wrong..!!", 2000);
            });
          }
        }
      })
    }
  }

  /*********************************************************** Edit Particular Manufacturer  *******************************************************************/

  editManufacturer(visit: any) {
    this.dialogData = {
      type: 'Edit',
      manufacturerId: visit.manufacturerId,
      title: visit.title,
    }
    const dialogRef = this.dialog.open(AddManufacturerComponent, {
      data: this.dialogData,
      width: '450px',
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllmanufacturers(this.pageNumber);
      }
    })
  }

}

export interface Manufacturer {
  manufacturerId: number;
  title: string;
}

