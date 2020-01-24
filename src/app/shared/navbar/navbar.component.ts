import { AuthenticationService } from '../../public service/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ManageOrganizationComponent } from '../manage-organization/manage-organization.component';
import { RoleService } from '../../modules/role/service/role.service';
import { SpinnerService } from '../../public service/spinner.service';
import { NavbarService } from '../../public service/navbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  displayName: String = '';
  displayOrg: String = '';
  panelOpenState: boolean = false;
  mobileQuery: MediaQueryList;
  isSuperadminNavigating: boolean = false;
  private _mobileQueryListener: () => void;
  orgNameFromLocStorage: any;
  orgFeatureList: any[] = [];
  featuretitle: any;
  featureCode: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private NavbarService: NavbarService,
    private roleService: RoleService,
    private spinnerService: SpinnerService,
    private router: Router,
    private snackBar: MatSnackBar,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dialog: MatDialog,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  navbarSubscription: Subscription = null;

  ngOnInit() {
    this.featurefromOrganization();
    this.subcribedToFeatureService();
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

  subcribedToFeatureService() {
    this.featureCode = [];
    this.orgFeatureList = [];
    this.navbarSubscription = this.NavbarService.getShouldReloadOrgFeatures().subscribe(res => {
      if (res == true) {
        this.NavbarService.setShouldReloadOrgFeatures(false);
        this.featurefromOrganization();
      }
    })
  }

  isCurrentUserSuperAdmin() {
    return JSON.parse(localStorage.getItem('currentUser')).data.role == 0;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToAdminChangePass() {
    this.router.navigate(['/profile/admin-change-password']);
  }

  goToSuperAdminChangePass() {
    this.router.navigate(['/profile/superadmin-change-password'])
  }

  logout() {
    this.authService.logout();
  }

  featurefromOrganization() {
    this.spinnerService.setSpinnerVisibility(true);
    this.roleService.getFeatureList().subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        this.orgFeatureList = [];
        this.orgFeatureList = res.features;
        this.featureCode = [];
        for (let feature of this.orgFeatureList) {
          this.featureCode.push(feature.featureCode)
        }
        /*   this.featureCode.forEach(element => {
            console.log('code', element);
          });
          if (this.featureCode.includes('BN1')) {
            console.log('user can add asset');
          } */
      } else {
        //this.featureCode = [];
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
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

  getDashboardRoute() {
    return JSON.parse(localStorage.getItem('currentUser')).data.role == 0 ? '/dashboard/admin' : '/dashboard';
  }

  getOrganizationNameMangingBySuperAdmin() {
    this.orgNameFromLocStorage = JSON.parse(localStorage.getItem('currentUser'));
    if (this.orgNameFromLocStorage && this.orgNameFromLocStorage.data) {
      if (this.orgNameFromLocStorage.data.role == 0) {
        if (JSON.parse(localStorage.getItem('currentUser')).data.OrgNameForSuperAdmin) {
          let orgNameForSuperAdmin = JSON.parse(localStorage.getItem('currentUser')).data.OrgNameForSuperAdmin;
          return (orgNameForSuperAdmin.length > 20) ? (orgNameForSuperAdmin.substring(0, 20) + '..') : orgNameForSuperAdmin;
        } else {
          return '';
        }
      } else if (this.orgNameFromLocStorage.data.role == 1) {
        if (JSON.parse(localStorage.getItem('currentUser')).data.organizationName) {
          let orgNameForAdmin = JSON.parse(localStorage.getItem('currentUser')).data.organizationName;
          return (orgNameForAdmin.length > 20) ? (orgNameForAdmin.substring(0, 20) + '..') : orgNameForAdmin;
        } else {
          return '';
        }
      }
    } else {
      return '';
    }
  }

  chooseOrganizationAndNavigate() {
    const dialogRef = this.dialog.open(ManageOrganizationComponent, {
      width: this.mobileQuery.matches ? '90vw' : '30vw',
      height: this.mobileQuery.matches ? '90vh' : '80vh',
    });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    if (this.navbarSubscription) {
      this.navbarSubscription.unsubscribe();
    }
  }

}
