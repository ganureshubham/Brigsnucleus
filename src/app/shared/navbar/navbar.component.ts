import { AuthenticationService } from '../../public service/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ManageOrganizationComponent } from '../manage-organization/manage-organization.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  displayName: String = '';
  displayOrg: String = '';
  panelOpenState: boolean = false;
  mobileQuery: MediaQueryList;
  isSuperadminNavigating: boolean = false;
  private _mobileQueryListener: () => void;
  orgNameFromLocStorage: any;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dialog: MatDialog,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {

    this.router.events.subscribe((val) => {
      if (this.router.url.includes('superadmin')) {
        this.isSuperadminNavigating = true;
      } else {
        this.isSuperadminNavigating = false;
      }
    });

    if (this.router.url.includes('superadmin')) {
      this.isSuperadminNavigating = true;
    } else {
      this.isSuperadminNavigating = false;
    }

    this.users();

  }

  isCurrentUserSuperAdmin() {
    return JSON.parse(localStorage.getItem('currentUser')).data.role == 0;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToChangePass() {
    this.router.navigate(['/profile/change-password']);
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

  navigateToDashboard() {

    if (JSON.parse(localStorage.getItem('currentUser')).data.role != 0) {
      this.router.navigate([JSON.parse(localStorage.getItem('currentUser')).data.role == 0 ? '/dashboard/admin' : '/dashboard']);
    } else {
      this.router.navigate(['/dashboard/superadmin'])
    }

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  getDashboardRoute() {
    return JSON.parse(localStorage.getItem('currentUser')).data.role == 0 ? '/dashboard/admin' : '/dashboard';
  }

  getOrganizationNameMangingBySuperAdmin() {
    this.orgNameFromLocStorage = JSON.parse(localStorage.getItem('currentUser'));
    if (this.orgNameFromLocStorage.data.role == 0) {
      let orgNameForSuperAdmin = JSON.parse(localStorage.getItem('currentUser')).data.OrgNameForSuperAdmin;
      return (orgNameForSuperAdmin.length > 20) ? (orgNameForSuperAdmin.substring(0, 20) + '..') : orgNameForSuperAdmin;
    } else if (this.orgNameFromLocStorage.data.role == 1) {
      let orgNameForAdmin = JSON.parse(localStorage.getItem('currentUser')).data.organizationName;
      return (orgNameForAdmin.length > 20) ? (orgNameForAdmin.substring(0, 20) + '..') : orgNameForAdmin;
    }

  }

  chooseOrganizationAndNavigate() {
    const dialogRef = this.dialog.open(ManageOrganizationComponent, {
      width: this.mobileQuery.matches ? '90vw' : '30vw',
      height: this.mobileQuery.matches ? '90vh' : '80vh',
    });
  }

}
