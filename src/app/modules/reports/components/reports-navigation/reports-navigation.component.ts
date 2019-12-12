import { Component, OnInit } from '@angular/core';

export interface Report {
  title: string;
  type: string;
  route: string;
}

@Component({
  selector: 'app-reports-navigation',
  templateUrl: './reports-navigation.component.html',
  styleUrls: ['./reports-navigation.component.css']
})
export class ReportsNavigationComponent implements OnInit {

  reports: Report[] = [
    {
      title: 'Complaints',
      type: 'Top pending complaints report',
      route: '/reports/pending-complaints'
    },
    {
      title: 'Tasks',
      type: 'Top pending tasks report',
      route: '/reports/pending-tasks'
    },
    {
      title: 'Assets',
      type: 'Top complaining assets report',
      route: '/reports/complaining-assets'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
