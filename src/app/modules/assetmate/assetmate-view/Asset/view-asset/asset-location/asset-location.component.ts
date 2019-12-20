import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetmateService } from 'src/app/modules/assetmate/service/assetmate.service';
import { SpinnerService } from 'src/app/public service/spinner.service';
import { MatSnackBar, MatTableDataSource, MatPaginator } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-asset-location',
  templateUrl: './asset-location.component.html',
  styleUrls: ['./asset-location.component.css']
})
export class AssetLocationComponent implements OnInit {

  assetId: number;

  lat: number = 18.4875251;
  lng: number = 73.7963455;

  loc: string = 'https://maps.google.com/maps?q=' + this.lat + ', ' + this.lng + '&z=15&output=embed';

  isReadyToRenderMap: boolean = false;
  displayedColumns: string[] = ['locationAddedDate', 'latitude', 'longitude'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  page: number = 0;
  count: number;
  pageNumber = 0;
  totalCount = 0;
  isNoRecordFound: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private assetMateService: AssetmateService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.assetId = this.route.snapshot.params['assetId'];
    this.getAssetLocation(this.assetId, this.pageNumber);
  }

  getAssetLocation(assetId: number, pageNo) {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetMateService.getAssetLocation(assetId, pageNo).subscribe(
      resp => {
        if (resp.status) {
          if (resp.currentPage == 0 && resp.totalCount == 0) {
            this.isNoRecordFound = true;
          } else {
            this.isNoRecordFound = false;
          }
          this.dataSource = resp.locations;
          if (resp.locations.length > 0) {
            this.loc = 'https://maps.google.com/maps?q=' + resp.locations[0].latitude + ', ' + resp.locations[0].longitude + '&z=15&output=embed';
          }
          this.pageNumber = resp.currentPage;
          this.totalCount = resp.totalCount;
          this.spinnerService.setSpinnerVisibility(false);
        } else {
          this.spinnerService.setSpinnerVisibility(false);
          // this.showSnackBar(resp.message);
        }
      },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  showLocation(location) {
    this.loc = 'https://maps.google.com/maps?q=' + location.latitude + ', ' + location.longitude + '&z=15&output=embed';
  }

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getAssetLocation(this.assetId, this.page)
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

}
