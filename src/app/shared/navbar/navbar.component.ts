import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../public service/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  displayName: any;
  displayOrg: any;




  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.users();
  }

  logout() {
    this.authService.logout();
  }

  users(): any {
    let user = localStorage.getItem('currentUser');
    var name = JSON.parse(user);
    this.displayName = name.data.firstName + ' ' + name.data.lastName;
    this.displayOrg = name.data.organizationName;

  }

}
