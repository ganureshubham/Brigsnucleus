import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../public service/notification.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';

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

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    if (!this.router.url.includes('admin') && (JSON.parse(localStorage.getItem('currentUser')).data.role == 0)) {
      this.router.navigate(['/dashboard/superadmin']);
    }
    this.getStatus();
    this.setMonthlyAssetsGraphData();
    this.setComplaintsRaisedGraphData();
    this.setCategoryWiseAssetsGraphData();
    this.setCategoryWisePendingMaintainanceGraphData();
  }

  /*****************************************Get All  Dashboard Counts*******************************************************************************/

  getStatus() {
    this.loading = true;
    this.notificationService.getDashboardDetails().subscribe(res => {
      this.rows = res.dashboard[0];
    })
  }

  /********************************************* Monthly Assets Added Graph***************************************************/

  setMonthlyAssetsGraphData() {
    this.data = {
      type: 'bar',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: 'Assets Added',
          data: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(204, 204, 255, 0.2)',
            'rgba(204,204,153,0.2)',
            'rgba(102,102,153,0.2)',
            'rgba(204,102,51,0.2)',
            'rgba(102,153,255,0.2)',
            'rgba(255,102,204,0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(204, 204, 255, 1)',
            'rgba(204,204,153,1)',
            'rgba(102,102,153,1)',
            'rgba(204,102,51,1)',
            'rgba(102,153,255,1)',
            'rgba(255,102,204,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Months'
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'No. Of Assets'
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

  /********************************************* Total Complaints Raised Per Month Graph***************************************************/

  setComplaintsRaisedGraphData() {
    this.data1 = {
      type: 'bar',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: 'Complaints Raised',
          data: [15, 6, 3, 5, 2, 6, 12, 19, 13, 4, 7, 15],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(204, 204, 255, 0.2)',
            'rgba(204,204,153,0.2)',
            'rgba(102,102,153,0.2)',
            'rgba(204,102,51,0.2)',
            'rgba(102,153,255,0.2)',
            'rgba(255,102,204,0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(204, 204, 255, 1)',
            'rgba(204,204,153,1)',
            'rgba(102,102,153,1)',
            'rgba(204,102,51,1)',
            'rgba(102,153,255,1)',
            'rgba(255,102,204,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Months'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'No. Of Complaints Raised'
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


  /*********************************************Category Wise Assets Graph  ***************************************************/


  setCategoryWiseAssetsGraphData() {
    this.data2 = {
      type: 'doughnut',
      data: {
        labels: ["Electronics", "Fire Brigade", "Machine", "Furniture", "Furniture1"],
        datasets: [{
          label: 'Assets',
          data: [15, 6, 3, 5, 2],
          backgroundColor: [
            '#339966',
            '#FFCC66',
            '#993399',
            '#333366',
            '#FF9966'
          ],
          borderColor: [
            '#339966',
            '#FFCC66',
            '#993399',
            '#333366',
            '#FF9966'
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
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
          display: false
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
