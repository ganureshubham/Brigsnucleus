import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../public service/notification.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { MatSnackBar, MatTableDataSource, MatPaginator } from '@angular/material';
import { SpinnerService } from '../public service/spinner.service';
import jsPDF from 'jspdf';
import { AssetmateService } from '../modules/assetmate/service/assetmate.service';

export interface Year {
  Id: number,
  data: string
}

interface Asset {
  assetId: number;
  isActive: string;
  assetCodeImage: string;
  assetCode: number;
  assetImage: string;
  assetTitle: string;
  categoryName: string;
  modelNumber: string;
  companyAssetNo: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  loading: boolean;
  rows: any = {};
  isChartReadyToRender: boolean = false;
  monthlyasset: any;
  monthlycomplaints: any;
  CatAsset: any;
  Pendingmaintainance: any;
  data: any;
  data1: any;
  data2: any;
  data3: any;
  data4: any;
  canvas: any;
  canvas1: any;
  canvas2: any;
  canvas3: any;
  canvas4: any;
  ctx: any;
  ctx1: any;
  ctx2: any;
  ctx3: any;
  ctx4: any;
  monthlyAssetgraphObj: any = {};
  monthlyComplaintsgraphObj: any = {};
  categwiseassetgraphObj: any = {};
  categwisemaintainancegraphObj: any = {};
  installlocwiseassetgraphObj: any = {};
  MonthlyAssetTitle: any;
  assetsdefaultyear: any;
  assetselectedyear: any;
  complaintselectedyear: any;
  complaintdefaultyear: any;
  MonthlyComplaintsTitle: any;
  CategoryAssetTitle: any;
  CategoryMaintainanceTitle: any;
  InstallLocAssetTitle: any;
  installationlocation: any;

  displayedColumns: string[] = ['assetTitle', 'addedBy', 'action'];

  count: number;
  pageNumber = 0;
  totalCount = 0;
  page: number = 0;
  dataSource: MatTableDataSource<Asset> = new MatTableDataSource();
  isNoRecordFound: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private assetmateService: AssetmateService
  ) {
  }

  ngOnInit() {
    if (!this.router.url.includes('admin') && (JSON.parse(localStorage.getItem('currentUser')).data.role == 0)) {
      this.router.navigate(['/dashboard/superadmin']);
    }
    this.assetsdefaultyear = this.years[4].Id;
    this.complaintdefaultyear = this.years[4].Id;
    this.selectedYearAssets(this.assetsdefaultyear);
    this.selectedYearComplaint(this.complaintdefaultyear);
    this.getStatus();
    this.setCategoryWisePendingMaintainanceGraphData();
    this.getMonthlyAssetAdded(this.assetselectedyear);
    this.monthlyComplaintsAssigned(this.complaintselectedyear);
    this.categoryWiseAssets();
    this.categoryWiseMaintainance();
    this.installationLocWiseAsset();

    this.getAllPendingVerificationAssets(this.pageNumber);

  }

  getAllPendingVerificationAssets(pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getAllPendingVerificationAssets(pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        console.log(res);

        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = res.Assets;
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

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getAllPendingVerificationAssets(this.page);
  }

  navigateToAssetDetails(assetId) {
    let categoryId = 1;
    this.router.navigate(['/assetmate/assetmate-details/' + categoryId + '/asset-details/' + assetId]);
  }

  years: Year[] = [
    { Id: 0, data: new Date().getFullYear() - 4 + '' },
    { Id: 1, data: new Date().getFullYear() - 3 + '' },
    { Id: 2, data: new Date().getFullYear() - 2 + '' },
    { Id: 3, data: new Date().getFullYear() - 1 + '' },
    { Id: 4, data: new Date().getFullYear() + '' }
  ];

  /*****************************************Get All  Dashboard Counts*******************************************************************************/

  getStatus() {
    this.loading = true;
    this.notificationService.getDashboardDetails().subscribe(res => {
      this.rows = res.dashboard[0];
    })
  }

  /********************************************* Select Year for Assets Added***************************************************/

  selectedYearAssets(value) {
    this.assetselectedyear = this.years[value].data;
    this.getMonthlyAssetAdded(this.assetselectedyear);
  }

  /********************************************* Monthly Assets Data Graph Api ***************************************************/

  getMonthlyAssetAdded(year: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.notificationService.getMonthlyAssetAdded(year).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status == true) {
        this.monthlyAssetgraphObj = res;
        this.MonthlyAssetTitle = res.graphTitle;
      } else {
        this.monthlyAssetgraphObj.xAxisData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.monthlyAssetgraphObj.yAxisData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.monthlyAssetgraphObj.xAxisLable = "Months";
        this.monthlyAssetgraphObj.yAxisLable = "Number of Assets";
        this.MonthlyAssetTitle = "Month wise Asset added";
      }
      this.setMonthlyAssetsGraphData();
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })

  }
  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /********************************************* Monthly Assets Added Graph***************************************************/

  setMonthlyAssetsGraphData() {
    this.data = {
      type: 'bar',
      data: {
        labels: this.monthlyAssetgraphObj.xAxisData,
        datasets: [{
          label: 'Assets Added',
          data: this.monthlyAssetgraphObj.yAxisData,
          backgroundColor: [
            'rgba(107, 102, 133, 0.31)',
            'rgba(107, 102, 133, 0.31)',
            'rgba(107, 102, 133, 0.31)',
            'rgba(107, 102, 133, 0.31)',
            'rgba(107, 102, 133, 0.31)',
            'rgba(107, 102, 133, 0.31)',
            'rgba(107, 102, 133, 0.31)',
            'rgba(107, 102, 133, 0.31)',
            'rgba(107, 102, 133, 0.31)',
            'rgba(107, 102, 133, 0.31)',
            'rgba(107, 102, 133, 0.31)',
            'rgba(107, 102, 133, 0.31)',
          ],
          borderColor: [
            'rgba(107, 102, 133, 1)',
            'rgba(107, 102, 133, 1)',
            'rgba(107, 102, 133, 1)',
            'rgba(107, 102, 133, 1)',
            'rgba(107, 102, 133, 1)',
            'rgba(107, 102, 133, 1)',
            'rgba(107, 102, 133, 1)',
            'rgba(107, 102, 133, 1)',
            'rgba(107, 102, 133, 1)',
            'rgba(107, 102, 133, 1)',
            'rgba(107, 102, 133, 1)',
            'rgba(107, 102, 133, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.monthlyAssetgraphObj.xAxisLable
            },
            gridLines: {
              drawOnChartArea: true
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.monthlyAssetgraphObj.yAxisLable
            },
            gridLines: {
              drawOnChartArea: true
            },
            ticks: {
              beginAtZero: true,
              // stepSize: 1
            }
          }]
        }
      }
    };

    setTimeout(() => {
      this.canvas = document.getElementById("monthlyasset");
      this.ctx = this.canvas.getContext("2d");
      if (this.monthlyasset != undefined) {
        this.monthlyasset.destroy();
      }
      this.monthlyasset = new Chart(this.ctx, this.data);
      this.isChartReadyToRender = true;
    }, 100)

  }


  /********************************************* Monthly Complaints Assigned Data Graph Api ****************************************/
  monthlyComplaintsAssigned(year: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.notificationService.monthlyComplaintsAssigned(year).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status == true) {
        this.monthlyComplaintsgraphObj = res;
        this.MonthlyComplaintsTitle = res.graphTitle;
      } else {
        this.monthlyComplaintsgraphObj.xAxisData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.monthlyComplaintsgraphObj.yAxisData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.monthlyComplaintsgraphObj.xAxisLable = "Months";
        this.monthlyComplaintsgraphObj.yAxisLable = "Number of Complaints Assigned";
        this.MonthlyComplaintsTitle = "Month wise Complaints Assigned";
      }
      this.setComplaintsRaisedGraphData();
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })

  }


  /********************************************* Select Year for Complaints Raised***************************************************/

  selectedYearComplaint(value) {
    this.complaintselectedyear = this.years[value].data;
    this.monthlyComplaintsAssigned(this.complaintselectedyear);
  }



  /********************************************* Total Complaints Raised Per Month Graph***********************************/

  setComplaintsRaisedGraphData() {
    this.data1 = {
      type: 'bar',
      data: {
        labels: this.monthlyComplaintsgraphObj.xAxisData,
        datasets: [{
          label: 'Complaints Assigned',
          data: this.monthlyComplaintsgraphObj.yAxisData,
          backgroundColor: [
            'rgba(114, 41, 174, 0.27)',
            'rgba(114, 41, 174, 0.27)',
            'rgba(114, 41, 174, 0.27)',
            'rgba(114, 41, 174, 0.27)',
            'rgba(114, 41, 174, 0.27)',
            'rgba(114, 41, 174, 0.27)',
            'rgba(114, 41, 174, 0.27)',
            'rgba(114, 41, 174, 0.27)',
            'rgba(114, 41, 174, 0.27)',
            'rgba(114, 41, 174, 0.27)',
            'rgba(114, 41, 174, 0.27)',
            'rgba(114, 41, 174, 0.27)',
          ],
          borderColor: [
            'rgba(114, 41, 174, 1)',
            'rgba(114, 41, 174, 1)',
            'rgba(114, 41, 174, 1)',
            'rgba(114, 41, 174, 1)',
            'rgba(114, 41, 174, 1)',
            'rgba(114, 41, 174, 1)',
            'rgba(114, 41, 174, 1)',
            'rgba(114, 41, 174, 1)',
            'rgba(114, 41, 174, 1)',
            'rgba(114, 41, 174, 1)',
            'rgba(114, 41, 174, 1)',
            'rgba(114, 41, 174, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.monthlyComplaintsgraphObj.xAxisLable
            },
            gridLines: {
              drawOnChartArea: true
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.monthlyComplaintsgraphObj.yAxisLable
            },
            gridLines: {
              drawOnChartArea: true
            },
            ticks: {
              beginAtZero: true,
              //stepSize: 1
            }
          }]
        }
      }
    };

    setTimeout(() => {
      this.canvas1 = document.getElementById("monthlycomplaints");
      this.ctx1 = this.canvas1.getContext("2d");
      if (this.monthlycomplaints != undefined) {
        this.monthlycomplaints.destroy();
      }
      this.monthlycomplaints = new Chart(this.ctx1, this.data1);
      this.isChartReadyToRender = true;
    }, 100)
  }


  /********************************************* Category Wise Assets Data Graph Api **********************************/

  categoryWiseAssets() {
    this.spinnerService.setSpinnerVisibility(true);
    this.notificationService.categoryWiseAssets().subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status == true) {
        this.categwiseassetgraphObj = res;
        this.categwiseassetgraphObj.color = [];
        if (this.categwiseassetgraphObj.categoryName.length > 15) {
          for (let i = 0; i < (this.categwiseassetgraphObj.categoryName.length - 15); i++) {
            this.categwiseassetgraphObj.color.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16));
          }
        }
        this.CategoryAssetTitle = res.Title;
      } else {
        this.categwiseassetgraphObj.categoryName = ["Category"];
        this.categwiseassetgraphObj.assetCount = [0];
        this.CategoryAssetTitle = "Category Wise Assets";
        this.categwiseassetgraphObj.color = ["#e5e5e5"];
      }
      this.setCategoryWiseAssetsGraphData();
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }



  /*********************************************Category Wise Assets Graph  ***************************************************/


  setCategoryWiseAssetsGraphData() {
    this.data2 = {
      type: 'doughnut',
      data: {
        labels: this.categwiseassetgraphObj.categoryName,
        datasets: [{
          label: 'Assets',
          data: this.categwiseassetgraphObj.assetCount,
          backgroundColor: [
            '#E1BEE7',
            '#B2DFDB',
            '#BBDEFB',
            '#CFD8DC',
            '#FFCDD2',
            '#F0F4C3',
            '#C8E6C9',
            '#FFCCBC',
            '#D7CCC8',
            '#DCEDC8',
            '#B2EBF2',
            '#C5CAE9',
            '#F8BBD0',
            '#FFCCBC',
            '#FFF9C4'
          ],
          borderColor: [
            '#CE93D8',
            '#80CBC4',
            '#90CAF9',
            '#B0BEC5',
            '#EF9A9A',
            '#E6EE9C',
            '#A5D6A7',
            '#FFAB91',
            '#BCAAA4',
            '#C5E1A5',
            '#80DEEA',
            '#9FA8DA',
            '#F48FB1',
            '#FFAB91',
            '#FFF59D'
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          // xAxes: [{
          //   scaleLabel: {
          //     display: true,
          //     labelString: 'Months'
          //   }
          // }],
          // yAxes: [{
          //   scaleLabel: {
          //     display: true,
          //     labelString: 'No. Of Complaints Raised'
          //   },
          //   ticks: {
          //     beginAtZero: true
          //   }
          // }]
        }
      }
    };

    setTimeout(() => {
      this.canvas2 = document.getElementById("CatAsset");
      this.ctx2 = this.canvas2.getContext("2d");
      if (this.CatAsset != undefined) {
        this.CatAsset.destroy();
      }
      this.CatAsset = new Chart(this.ctx2, this.data2);
      this.isChartReadyToRender = true;
    }, 100)
  }

  /********************************************* Category Wise Pending Maintainance Graph Api **********************************/

  categoryWiseMaintainance() {
    this.spinnerService.setSpinnerVisibility(true);
    this.notificationService.categoryWiseMaintainance().subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status == true) {
        this.categwisemaintainancegraphObj = res;
        this.categwisemaintainancegraphObj.color = [];
        if (this.categwisemaintainancegraphObj.categoryName.length > 15) {
          for (let i = 0; i < (this.categwisemaintainancegraphObj.categoryName.length - 15); i++) {
            this.categwisemaintainancegraphObj.color.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16));
          }
        }
        this.CategoryMaintainanceTitle = res.Title;
      } else {
        this.categwisemaintainancegraphObj.categoryName = ["Category"];
        this.categwisemaintainancegraphObj.assetCount = [0];
        this.CategoryMaintainanceTitle = "Category Wise Pending Maintenance Assets Count";
        this.categwisemaintainancegraphObj.color = ["#443c31"];
      }
      this.setCategoryWisePendingMaintainanceGraphData();
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }


  /********************************************* Category Wise Pending Maintainance Graph***************************************************/

  setCategoryWisePendingMaintainanceGraphData() {
    this.data3 = {
      type: 'doughnut',
      data: {
        labels: this.categwisemaintainancegraphObj.categoryName,
        datasets: [{
          label: 'Assets',
          data: this.categwisemaintainancegraphObj.assetCount,
          backgroundColor: [
            '#F8BBD0',
            '#C5CAE9',
            '#E1BEE7',
            '#FFCDD2',
            '#BBDEFB',
            '#B2DFDB',
            '#F0F4C3',
            '#C8E6C9',
            '#FFCCBC',
            '#D7CCC8',
            '#CFD8DC',
            '#DCEDC8',
            '#B2EBF2',
            '#FFCCBC',
            '#FFF9C4'
          ],
          borderColor: [
            '#F48FB1',
            '#9FA8DA',
            '#CE93D8',
            '#EF9A9A',
            '#90CAF9',
            '#80CBC4',
            '#E6EE9C',
            '#A5D6A7',
            '#FFAB91',
            '#BCAAA4',
            '#B0BEC5',
            '#C5E1A5',
            '#80DEEA',
            '#FFAB91',
            '#FFF59D'
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
        }
      }
    };

    setTimeout(() => {
      this.canvas3 = document.getElementById("Pendingmaintainance");
      this.ctx3 = this.canvas3.getContext("2d");
      if (this.Pendingmaintainance != undefined) {
        this.Pendingmaintainance.destroy();
      }
      this.Pendingmaintainance = new Chart(this.ctx3, this.data3);
      this.isChartReadyToRender = true;
    }, 100)
  }

  /********************************************* Installation Loc Wise Asset Graph Api **********************************/

  installationLocWiseAsset() {
    this.spinnerService.setSpinnerVisibility(true);
    this.notificationService.installationLocWiseAsset().subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status == true) {
        this.installlocwiseassetgraphObj = res;
        this.installlocwiseassetgraphObj.color = [];
        if (this.installlocwiseassetgraphObj.installationLocationName.length > 15) {
          for (let i = 0; i < (this.installlocwiseassetgraphObj.installationLocationName.length - 15); i++) {
            this.installlocwiseassetgraphObj.color.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16));
          }
        }
        this.InstallLocAssetTitle = res.Title;
      } else {
        this.installlocwiseassetgraphObj.installationLocationName = ["Installation Location"];
        this.installlocwiseassetgraphObj.assetCount = [0];
        this.InstallLocAssetTitle = "Installation location wise assets";
        this.installlocwiseassetgraphObj.color = ['#BCAAA4'];
      }
      this.setInstallationLocWiseAssetGraphData();
    })
  }


  /********************************************* Installation Loc Wise Asset Graph ***************************************************/

  setInstallationLocWiseAssetGraphData() {
    this.data4 = {
      type: 'doughnut',
      data: {
        labels: this.installlocwiseassetgraphObj.installationLocationName,
        datasets: [{
          label: 'Assets',
          data: this.installlocwiseassetgraphObj.assetCount,
          backgroundColor: [
            '#C8E6C9',
            '#CFD8DC',
            '#DCEDC8',
            '#B2EBF2',
            '#C5CAE9',
            '#F8BBD0',
            '#FFCCBC',
            '#FFF9C4',
            '#F0F4C3',
            '#FFCCBC',
            '#D7CCC8',
            '#E1BEE7',
            '#FFCDD2',
            '#BBDEFB',
            '#B2DFDB'
          ],
          borderColor: [
            '#A5D6A7',
            '#B0BEC5',
            '#C5E1A5',
            '#80DEEA',
            '#9FA8DA',
            '#F48FB1',
            '#FFAB91',
            '#FFF59D',
            '#E6EE9C',
            '#FFAB91',
            '#BCAAA4',
            '#CE93D8',
            '#EF9A9A',
            '#90CAF9',
            '#80CBC4'
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
        }
      }
    };

    setTimeout(() => {
      this.canvas4 = document.getElementById("installationlocation");
      this.ctx4 = this.canvas4.getContext("2d");
      if (this.installationlocation != undefined) {
        this.installationlocation.destroy();
      }
      this.installationlocation = new Chart(this.ctx4, this.data4);
      this.isChartReadyToRender = true;
    }, 100)
  }

  printGraph(elementId: string, title: string) {

    let newCanvas = <HTMLCanvasElement>document.getElementById(elementId);;
    let newCanvasImg = newCanvas.toDataURL('jpeg', 1.0);

    let doc = new jsPDF('l', 'mm', [520, 300]);
    let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    let pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    doc.addImage(newCanvasImg, 'JPEG', 10, 15, pageWidth - 20, pageHeight - 20);
    doc.setFontSize(13);
    doc.text(title, pageWidth / 2, 10, 'center');

    window.open(doc.output('bloburl'), '_blank');
  }

  verifiedAsset() {
    console.log('verifiedAsset');
  }

  deleteAsset() {
    console.log('deleteAsset');
  }


}
