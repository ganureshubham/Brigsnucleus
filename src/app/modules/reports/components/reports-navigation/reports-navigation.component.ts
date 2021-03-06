import { Component, OnInit } from '@angular/core';

export interface Report {
  title: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-reports-navigation',
  templateUrl: './reports-navigation.component.html',
  styleUrls: ['./reports-navigation.component.css']
})
export class ReportsNavigationComponent implements OnInit {

  reports: Report[] = [
    {
      title: 'Pending Complaints',
      route: '/reports/pending-complaints',
      icon: 'menu_book'
    },
    {
      title: 'Pending Tasks',
      route: '/reports/pending-tasks',
      icon: 'work'
    },
    {
      title: 'Pending Maintainance Assets',
      route: '/reports/pending-maintainance-assets',
      icon: 'description'
    },
    {
      title: 'Critical Cond. Assets',
      route: '/reports/critical-assets',
      icon: 'assignment_late'
    },
    {
      title: 'Category Wise Assets',
      route: '/reports/category-wise-assets',
      icon: 'assignment'
    },
    {
      title: 'All Assets',
      route: '/reports/all-assets',
      icon: 'assignment'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
