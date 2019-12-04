import { Component, OnInit, Inject } from '@angular/core';
import { ManageOrganizationService } from '../../public service/manage-organization.service';
import { SpinnerService } from '../../public service/spinner.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-organization',
  templateUrl: './manage-organization.component.html',
  styleUrls: ['./manage-organization.component.css']
})
export class ManageOrganizationComponent implements OnInit {

  arrOrganizations: any[] = [];

  constructor(
    private manageOrganizationService: ManageOrganizationService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllOrganizations();
  }

  getAllOrganizations() {
    this.spinnerService.setSpinnerVisibility(true);
    this.manageOrganizationService.getAllOrganizations().subscribe(
      (resp: any) => {
        this.spinnerService.setSpinnerVisibility(false);
        if (resp.organization) {
          this.arrOrganizations = resp.organization;
        } else {
          this.showSnackBar(resp.message)
        }
      },
      err => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar('Something went wrong..!!')
      }
    );
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  onNoClick(): void {
    this.dialogRef.close({ action: false });
  }

  goToParticularOrganization(organizationId) {

    this.spinnerService.setSpinnerVisibility(true);
    this.manageOrganizationService.getOrganizationSpecificToken(organizationId).subscribe((resp: any) => {
      this.spinnerService.setSpinnerVisibility(false);
      if (resp.status) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.data.token = resp.token;
        currentUser.data.OrgNameForSuperAdmin = resp.organizationName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.dialogRef.close({ action: true });

        let isReloadNeeded: boolean = false;

        if (this.router.url.includes('/dashboard/admin')) {
          isReloadNeeded = true;
        } else {
          isReloadNeeded = false;
        }

        this.router.navigate(['/dashboard/admin']).then(() => {
          if (isReloadNeeded) {
            window.location.reload()
          }
        });

      } else {
        this.showSnackBar("Something went wrong..!!");
      }
    }, err => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar("Something went wrong..!!");
    });

  }

}
