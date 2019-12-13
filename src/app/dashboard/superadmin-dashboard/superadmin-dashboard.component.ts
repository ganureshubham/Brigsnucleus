import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../public service/notification.service';
import { Chart } from 'chart.js';
import { MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../public service/spinner.service';

export interface Year {
  Id: number,
  data: string

}

@Component({
  selector: 'app-superadmin-dashboard',
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})




export class SuperadminDashboardComponent implements OnInit {



  superAdminDashboardCounts: any = {};
  isChartReadyToRender: boolean = false;
  mycanvas: any;
  mycanvas1: any;
  data: any;
  data1: any;
  canvas: any;
  ctx: any;
  canvas1: any;
  ctx1: any;
  defaultyear: any;
  monthlyGraphObj: any = {};
  topOrgAssetObj: any = {};
  MonthlyGraphTitle: any;
  selectedyear: any;
  TopOrgAssetTitle: any;


  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
  ) { }

  ngOnInit() {
    this.getSupeAdminDashboardCounts();
    this.defaultyear = this.years[4].Id;
    this.selectedYear(this.defaultyear);
    this.getMonthlyOrdGraphData(this.selectedyear);
    this.getTopOrgGraphData();

  }

  years: Year[] = [
    { Id: 0, data: new Date().getFullYear() - 4 + '' },
    { Id: 1, data: new Date().getFullYear() - 3 + '' },
    { Id: 2, data: new Date().getFullYear() - 2 + '' },
    { Id: 3, data: new Date().getFullYear() - 1 + '' },
    { Id: 4, data: new Date().getFullYear() + '' }
  ];


  /********************************************* Dashboard Counts***************************************************/

  getSupeAdminDashboardCounts() {
    this.notificationService.getSuperAdminDashboardDetails().subscribe(resp => {
      if (resp && resp.dashboard && (resp.dashboard.length > 0)) {
        this.superAdminDashboardCounts = resp.dashboard[0];
      }
    })
  }

  /********************************************* Monthly Org Data from Api***************************************************/

  getMonthlyOrdGraphData(year: any) {
    this.spinnerService.setSpinnerVisibility(true);
    this.notificationService.getMonthlyOrgGraphData(year).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status == true) {
        this.monthlyGraphObj = res;
        this.MonthlyGraphTitle = res.graphTitle;
      } else {
        this.monthlyGraphObj.xAxisData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.monthlyGraphObj.yAxisData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.monthlyGraphObj.xAxisLable = 'Months';
        this.monthlyGraphObj.yAxisLable = 'Number of Organizations';
        this.MonthlyGraphTitle = 'Month wise organizations added';
      }
      this.setMonthlyOrgGraphData();
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");

      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /********************************************* Top Assets level Org Data from Api***************************************************/

  getTopOrgGraphData() {
    this.spinnerService.setSpinnerVisibility(true);
    this.notificationService.getTopOrgGraphData().subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status == true) {
        this.topOrgAssetObj = res;
        this.TopOrgAssetTitle = res.graphTitle;
      } else {
        this.topOrgAssetObj.xAxisData = [" ", " ", " ", " ", " "];
        this.topOrgAssetObj.yAxisData = [0, 0, 0, 0, 0];
        this.topOrgAssetObj.xAxisLable = "Organizations";
        this.topOrgAssetObj.yAxisLable = "Number of Assets";
        this.TopOrgAssetTitle = "TOP ASSETS ORGANIZATIONS";
      }
      this.setTopOrgGraphData();
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

  /********************************************* Select Year***************************************************/

  selectedYear(value) {
    this.selectedyear = this.years[value].data;
    this.getMonthlyOrdGraphData(this.selectedyear);
  }

  /********************************************* Monthly Org By Current Year***************************************************/

  setMonthlyOrgGraphData() {
    this.data = {
      type: 'bar',
      data: {
        labels: this.monthlyGraphObj.xAxisData,
        datasets: [{
          label: 'Organizations',
          data: this.monthlyGraphObj.yAxisData,
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
            'rgba(114, 41, 174,1)',
            'rgba(114, 41, 174,1)',
            'rgba(114, 41, 174,1)',
            'rgba(114, 41, 174,1)',
            'rgba(114, 41, 174,1)',
            'rgba(114, 41, 174,1)',
            'rgba(114, 41, 174,1)',
            'rgba(114, 41, 174,1)',
            'rgba(114, 41, 174,1)',
            'rgba(114, 41, 174,1)',
            'rgba(114, 41, 174,1)',
            'rgba(114, 41, 174,1)',
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
              labelString: this.monthlyGraphObj.xAxisLable
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.monthlyGraphObj.yAxisLable
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

  /********************************************* Top 5 Org Per Assets***************************************************/

  setTopOrgGraphData() {
    this.data1 = {
      type: 'bar',
      data: {
        labels: this.topOrgAssetObj.xAxisData,
        datasets: [{
          label: 'Assets',
          data: this.topOrgAssetObj.yAxisData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: true
        },
        // tooltips: {
        //   callbacks: {
        //     label: function (tooltipItem) {
        //       return tooltipItem.yLabel;
        //     }
        //   }
        // },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.topOrgAssetObj.xAxisLable
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.topOrgAssetObj.yAxisLable
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






}
