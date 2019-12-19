import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LocationTypeService } from '../../service/location-type.service';
import { DialogService } from '../../../../public service/dialog.service';
import { SpinnerService } from '../../../../public service/spinner.service';
import { AddLocationTypeComponent } from '../add-location-type/add-location-type.component';
import { AppDialogData } from '../../../../model/appDialogData';

@Component({
  selector: 'app-view-location-type',
  templateUrl: './view-location-type.component.html',
  styleUrls: ['./view-location-type.component.css']
})
export class ViewLocationTypeComponent implements AfterViewInit, OnDestroy {

  loading: boolean;
  public page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  supplierData: any = {};
  supplierName: any;
  isAlreadySubscribedToDialogUserActionService: boolean = false;
  isNoRecordFound: boolean = false;
  //dialogData: supplierDialogData;

  displayedColumns: string[] = ['installationLocationName', 'Actions'];
  paidDataSource: MatTableDataSource<LocationType> = new MatTableDataSource();

  @ViewChild('paidPaginator') paginator: MatPaginator;

  previousSubscription: Subscription;
  upcomingSubscription: Subscription;
  Router: any;
  supplierId: number;
  installationLocationTypeId: number;

  constructor(
    private router: Router,
    private locationTypeService: LocationTypeService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private dialog: MatDialog
  ) {

  }

  ngAfterViewInit(): void {
    // Add paginators to datastore here, because we need the view to
    // have created the paginator elements
    this.paidDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getAllLocationList();
  }

  ngOnDestroy(): void { }

  /*********************************************************** Get All Location Type *******************************************************************/

  getAllLocationList() {
    this.spinnerService.setSpinnerVisibility(true);
    this.locationTypeService.getAllLocationList().subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.installationLocationList) {
        if (res.installationLocationList.length == 0) {
          this.isNoRecordFound = true;
          this.showSnackBar(res.message);
        } else {
          this.isNoRecordFound = false;
        }
        this.paidDataSource = res.installationLocationList;
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

  /*********************************************************** Add Installation Location *******************************************************************/

  addLocationType() {
    const dialogRef = this.dialog.open(AddLocationTypeComponent, {
      data: { type: 'Add' },
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllLocationList();
      }
    });
  }

  /*********************************************************** Delete Particular Installation Location *******************************************************************/

  deleteLocationType(installationLocationTypeId: number, installationLocationName: string) {
    this.installationLocationTypeId = installationLocationTypeId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE INSTALLATION LOCATION',
      message: ` Are your sure you want to delete Installation Location "${installationLocationName}"`,
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
          this.locationTypeService.deleteInstallationLoc(this.installationLocationTypeId).subscribe(res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.getAllLocationList();
          }, error => {
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }
  }

  /*********************************************************** Edit Particular Installation Location  *******************************************************************/

  editLocationType(visit: any) {

    let dialogData = {
      type: 'Edit',
      value: visit
    }
    const dialogRef = this.dialog.open(AddLocationTypeComponent, {
      data: dialogData,
      width: '450px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllLocationList();
      }
    });
  }

}

export interface LocationType {
  "installationLocationTypeId": number,
  "installationLocationName": string;
}

