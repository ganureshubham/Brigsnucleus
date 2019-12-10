import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../public service/notification.service';
import { Chart } from 'chart.js';

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
  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.getSupeAdminDashboardCounts();
    this.setMonthlyOrgGraphData();
    this.setTopOrgGraphData();
  }

  getSupeAdminDashboardCounts() {
    this.notificationService.getSuperAdminDashboardDetails().subscribe(resp => {
      if (resp && resp.dashboard && (resp.dashboard.length > 0)) {
        this.superAdminDashboardCounts = resp.dashboard[0];
      }
    })
  }

  /********************************************* Monthly Org By Current Year***************************************************/

  setMonthlyOrgGraphData() {
    this.data = {
      type: 'bar',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: 'Organizations',
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
              labelString: 'No. Of Organization'
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
        labels: ["Org1", "Org2", "Org3", "Org4", "Org5"],
        datasets: [{
          label: 'Assets',
          data: [12, 19, 3, 5, 2],
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
          display: false
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
              labelString: 'Organizations'
            }
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
      this.canvas1 = document.getElementById("topOrg");
      this.ctx1 = this.canvas1.getContext("2d");
      this.mycanvas1 = new Chart(this.ctx1, this.data1);
      this.isChartReadyToRender = true;
    }, 100)
  }




}
