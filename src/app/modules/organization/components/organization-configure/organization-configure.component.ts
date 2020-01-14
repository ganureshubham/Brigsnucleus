import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organization-configure',
  templateUrl: './organization-configure.component.html',
  styleUrls: ['./organization-configure.component.css']
})
export class OrganizationConfigureComponent implements OnInit {
  formtitle: string = 'Configure Organization'

  constructor() { }

  ngOnInit() {
  }

}
