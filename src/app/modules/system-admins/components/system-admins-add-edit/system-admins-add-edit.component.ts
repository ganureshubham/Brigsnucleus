import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { SpinnerService } from 'src/app/public service/spinner.service';
import { SystemadminsService } from '../../services/systemadmins.service';

interface AdminDetails {
	firstName: string,
	lastName: string,
	organizationIdFK: Number,
	mobileNumber: string,
	emailId: string,
	password: string
}

@Component({
	selector: 'app-system-admins-add-edit',
	templateUrl: './system-admins-add-edit.component.html',
	styleUrls: ['./system-admins-add-edit.component.css']
})
export class SystemAdminsAddEditComponent implements OnInit {

	adminForm: FormGroup;
	isCurrentOperationEdit: boolean = false;
	admin: any = {};
	arrOrganization: any[] = [];
	hide: boolean = true;

	constructor(
		public dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private formBuilder: FormBuilder,
		private spinnerService: SpinnerService,
		private systemadminsService: SystemadminsService,
		private snackBar: MatSnackBar,
	) { }

	ngOnInit() {
		this.getAllOrgnaization();
		this.setFormControls();
		if (this.data.action == 'edit') {
			this.admin = this.data.admin;
			this.setFormControlsValue();
			this.isCurrentOperationEdit = true;
		} else {
			this.isCurrentOperationEdit = false;
		}
	}

	getAllOrgnaization() {
		this.spinnerService.setSpinnerVisibility(true);
		this.systemadminsService.getAllOrganizations().subscribe(
			(resp: any) => {
				this.spinnerService.setSpinnerVisibility(false);
				if (resp && resp.organization) {
					this.arrOrganization = resp.organization;
				} else {
					this.showSnackBar(resp.message);
				}
			},
			err => {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar("Something went wrong..!!");
			}
		);
	}

	setFormControls() {
		this.adminForm = this.formBuilder.group({
			firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), this.noWhitespaceValidator]],
			lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), this.noWhitespaceValidator]],
			organization: [1, Validators.required],
			mobileNo: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/), Validators.minLength(10), Validators.maxLength(10)]],
			emailId: ['', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
			password: ['', this.data.action != 'edit' ? [Validators.required, Validators.minLength(6)] : null]
		});
	}

	noWhitespaceValidator(control: FormControl) {
		const isWhitespace = (control.value || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}

	setFormControlsValue() {
		this.adminForm.controls['firstName'].setValue(this.admin.firstName);
		this.adminForm.controls['lastName'].setValue(this.admin.lastName);
		this.adminForm.controls['organization'].setValue(this.admin.organizationIdFK);
		this.adminForm.controls['mobileNo'].setValue(this.admin.mobileNumber);
		this.adminForm.controls['emailId'].setValue(this.admin.emailId);
		this.adminForm.controls['password'].setValue('');
	}

	onNoClick() {
		this.dialogRef.close({ action: false });
	}

	addAdmin() {

		this.spinnerService.setSpinnerVisibility(true);

		let adminDetails: AdminDetails = {
			firstName: this.adminForm.get('firstName').value,
			lastName: this.adminForm.get('lastName').value,
			organizationIdFK: this.adminForm.get('organization').value,
			mobileNumber: this.adminForm.get('mobileNo').value.toString(),
			emailId: this.adminForm.get('emailId').value,
			password: this.adminForm.get('password').value
		};

		this.systemadminsService.addAdmin(adminDetails).subscribe(resp => {
			this.spinnerService.setSpinnerVisibility(false);
			this.showSnackBar(resp.message);
			if (resp && resp.status) {
				this.dialogRef.close({ action: true });

			}
		},
			err => {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar("Something went wrong..!!");
			}
		);

	}

	editAdmin() {

		this.spinnerService.setSpinnerVisibility(true);

		let adminDetails: AdminDetails = {
			firstName: this.adminForm.get('firstName').value,
			lastName: this.adminForm.get('lastName').value,
			organizationIdFK: this.adminForm.get('organization').value,
			mobileNumber: this.adminForm.get('mobileNo').value.toString(),
			emailId: this.adminForm.get('emailId').value,
			password: this.adminForm.get('password').value == '' ? this.admin.password : this.adminForm.get('password').value
		};

		this.systemadminsService.editAdmin(this.data.admin.adminId, adminDetails).subscribe(resp => {
			this.spinnerService.setSpinnerVisibility(false);
			this.showSnackBar(resp.message);
			if (resp && resp.status) {
				this.dialogRef.close({ action: true });
			}
		},
			err => {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar("Something went wrong..!!");
			}
		);

	}

	showSnackBar(message: string) {
		this.snackBar.open(message, '', { duration: 4000 });
	}

}
