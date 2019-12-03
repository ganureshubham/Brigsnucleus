import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../public service/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading: boolean;
  rows: any = {};

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
  }

  /*****************************************Get All  Dashboard Counts*******************************************************************************/

  getStatus() {
    this.loading = true;
    this.notificationService.getDashboardDetails().subscribe(res => {
      this.rows = res.dashboard[0];
    })
  }

}
