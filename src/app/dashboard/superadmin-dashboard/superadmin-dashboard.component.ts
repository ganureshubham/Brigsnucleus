import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../public service/notification.service';

@Component({
  selector: 'app-superadmin-dashboard',
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})
export class SuperadminDashboardComponent implements OnInit {

  superAdminDashboardCounts: any = {};

  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.getSupeAdminDashboardCounts();
  }

  getSupeAdminDashboardCounts() {
    this.notificationService.getSuperAdminDashboardDetails().subscribe(resp => {
      if (resp && resp.dashboard && (resp.dashboard.length > 0)) {
        this.superAdminDashboardCounts = resp.dashboard[0];
      }
    })
  }

}
