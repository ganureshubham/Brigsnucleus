import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../public service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  displayName: String = '';
  displayOrg: String = '';




  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.users();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
  }

  users(): any {
    let user = localStorage.getItem('currentUser');
    var name = JSON.parse(user);
    if (name) {
      this.displayName = name.data.firstName + ' ' + name.data.lastName;
      this.displayOrg = name.data.organizationName;
    }
  }

}
