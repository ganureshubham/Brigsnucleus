import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../public service/notification.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { MatSnackBar } from '@angular/material';
import { SpinnerService } from '../public service/spinner.service';

export interface Year {
  Id: number,
  data: string

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
  mycanvas: any;
  mycanvas1: any;
  mycanvas2: any;
  mycanvas3: any;
  data: any;
  data1: any;
  data2: any;
  data3: any;
  canvas: any;
  canvas1: any;
  canvas2: any;
  canvas3: any;
  ctx: any;
  ctx1: any;
  ctx2: any;
  ctx3: any;
  monthlyAssetgraphObj: any = {};
  monthlyComplaintsgraphObj: any = {};
  categwiseassetgraphObj: any = {};
  MonthlyAssetTitle: any;
  assetsdefaultyear: any;
  assetselectedyear: any;
  complaintselectedyear: any;
  complaintdefaultyear: any;
  MonthlyComplaintsTitle: any;
  CategoryAssetTitle: any;



  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
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
        this.monthlyAssetgraphObj.xAxisData = [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "];
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
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.monthlyAssetgraphObj.yAxisLable
            },
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    };

    setTimeout(() => {
      this.canvas = document.getElementById("mycanvas");
      this.ctx = this.canvas.getContext("2d");
      this.mycanvas = new Chart(this.ctx, this.data);
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
        this.monthlyComplaintsgraphObj.xAxisData = [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "];
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
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.monthlyComplaintsgraphObj.yAxisLable
            },
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    };

    setTimeout(() => {
      this.canvas1 = document.getElementById("topOrg");
      this.ctx1 = this.canvas1.getContext("2d");
      this.mycanvas1 = new Chart(this.ctx1, this.data1);
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
        for (let category of this.categwiseassetgraphObj.categoryName) {
          this.categwiseassetgraphObj.color.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16));
        }
        this.CategoryAssetTitle = res.Title;
      } else {
        this.categwiseassetgraphObj.categoryName = [""];
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
          backgroundColor: this.categwiseassetgraphObj.color,
          borderColor: this.categwiseassetgraphObj.color,
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
      this.mycanvas2 = new Chart(this.ctx2, this.data2);
      this.isChartReadyToRender = true;
    }, 100)
  }


  /********************************************* Category Wise Pending Maintainance Graph***************************************************/

  setCategoryWisePendingMaintainanceGraphData() {
    this.data3 = {
      type: 'doughnut',
      data: {
        labels: ["Electronics", "Fire Brigade", "Machine", "Furniture", "Furniture1"],
        datasets: [{
          label: 'Assets',
          data: [15, 6, 3, 5, 2],
          backgroundColor: [
            '#FFCC66',
            '#FF6384',
            '#993399',
            '#FF9966',
            '#333366',
          ],
          borderColor: [
            '#FFCC66',
            '#FF6384',
            '#993399',
            '#FF9966',
            '#333366',
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
      this.mycanvas3 = new Chart(this.ctx3, this.data3);
      this.isChartReadyToRender = true;
    }, 100)
  }






}
