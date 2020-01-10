import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetmateService } from '../../../../service/assetmate.service';
import { SpinnerService } from '../../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { AssetCodeComponent } from '../../asset-code/asset-code.component';
import { DataSharingService } from '../../../../../../public service/data-sharing.service';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { AppImgDialogComponent } from '../../../../../../shared/app-img-dialog/app-img-dialog.component';
import { Location } from '@angular/common';

@Component({
	selector: 'app-details-asset',
	templateUrl: './details-asset.component.html',
	styleUrls: ['./details-asset.component.css']
})
export class DetailsAssetComponent implements OnInit {

	assetData: any = {};
	showFirst: boolean = false;
	category: any;
	assetcode: any = 'test_code';
	categoryId: number;
	assetId: number;
	userGuideFileExtension: string = '';
	userGuideFileName: string = '';
	assetForQRcode: any = {};
	assetCode1: string = '1';

	constructor(private router: Router,
		private route: ActivatedRoute,
		private assetmateService: AssetmateService,
		private spinnerService: SpinnerService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		public dataService: DataSharingService,
		private location: Location,
	) { }

	ngOnInit() {
		this.assetData.image = "assets/img/user.png";
		this.categoryId = this.route.snapshot.params['categoryId'];
		this.assetId = this.route.snapshot.params['assetId'];
		this.viewAsset();
		this.subscribeToBadgeUpdateService();
	}

	subscribeToBadgeUpdateService() {
		this.assetmateService.getBadgeUpdateAction('assetDetails').subscribe(res => {
			if (res) {
				this.assetmateService.setBadgeUpdateAction('assetDetails', false);
				this.viewAsset();
			}
		});
	}

	isCurrentUserAdmin() {
		return JSON.parse(localStorage.getItem('currentUser')).data.role == 1;
	}

	verifyAsset(assetId: number) {
		let body = {
			isVerified: 1
		}
		this.spinnerService.setSpinnerVisibility(true);
		this.assetmateService.verifyAsset(assetId, body).subscribe(res => {
			this.spinnerService.setSpinnerVisibility(false);
			if (res.status) {
				this.showSnackBar(res.message);
				this.location.back();
			} else {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar(res.message);

			}
		},
			error => {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar('Something went wrong..!!');
			})


	}

	viewAsset() {

		this.spinnerService.setSpinnerVisibility(true);
		this.assetmateService.viewAsset(this.assetId).subscribe(res => {
			this.spinnerService.setSpinnerVisibility(false);
			if (res.asset) {
				this.assetData = res.asset;
				this.assetcode = res.asset.assetCode;
				if (res.asset.userGuideBook !== null) {
					let arrSplittedUserGuidePath: string[] = res.asset.userGuideBook.split('.');
					this.userGuideFileExtension = arrSplittedUserGuidePath[arrSplittedUserGuidePath.length - 1];
					arrSplittedUserGuidePath = res.asset.userGuideBook.split('/');
					this.userGuideFileName = (arrSplittedUserGuidePath[arrSplittedUserGuidePath.length - 1]).split('.')[0];
				}

			} else {
				this.showSnackBar(res.message);
			}

		},
			error => {
				this.showSnackBar('Something went wrong..!!');
			})

	}

	/*********************************************************** Preview Particular Asset Image  *******************************************************************/

	priviewImage(title, imageUrl) {
		this.dialog.open(AppImgDialogComponent, {
			data: { imageType: 'Asset', imageTitle: title, imageUrl: imageUrl, },
			width: '90vw',
			height: '80vh',
			panelClass: 'app-img-dialog',
			backdropClass: 'app-img-dialog-backdrop'
		});
	}


	showSnackBar(message: string) {
		this.snackBar.open(message, '', { duration: 2000 });
	}

	backToList() {
		// this.router.navigate([`/assetmate/assetmate-details/${this.categoryId}`]);
		this.assetmateService.setTabSelection('checklistTab', 0);
		this.location.back();
	}

	listAsset() {
		this.router.navigate([`/assetmate/assetmate-details/${this.categoryId}`]);
	}

	openQRCodeDialog(assetCode) {
		this.dataService.saveData(assetCode);
		const dialogRef = this.dialog.open(AssetCodeComponent, {
		});
	}

	downloadDocument(file) {
		const Ext = file.split('/').pop().split('?')[0]; // splits url into file name
		saveAs(file, Ext);
	}

	activateAsset(value: any) {

		this.assetData.isActive = value.checked;
		let body = {
			isActive: value.checked ? 1 : 0
		}
		this.spinnerService.setSpinnerVisibility(true);
		this.assetmateService.assetActive(this.assetData.assetId, body).subscribe(res => {
			this.spinnerService.setSpinnerVisibility(false);
			this.showSnackBar(res.message);
			if (!res.status) {
				this.assetData.isActive = !value.checked;
			}
		},
			error => {
				this.assetData.isActive = !value.checked;
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar("Something went wrong..!!");
			})
	}

	retireAsset(value: any) {
		this.assetData.isRetired = value.checked;
		let body = {
			isRetired: value.checked ? 1 : 0
		}
		this.spinnerService.setSpinnerVisibility(true);
		this.assetmateService.assetRetire(this.assetData.assetId, body).subscribe(res => {
			this.spinnerService.setSpinnerVisibility(false);
			this.showSnackBar(res.message);

			if (!res.status) {
				this.assetData.isRetired = !value.checked;
			}

		},
			error => {
				this.assetData.isRetired = !value.checked;
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar("Something went wrong..!!");
			})
	}

	printQRcode() {

		let imageLeftMargin = 5;
		let textLeftMargin = 60;
		let allCompTopMargin = 5;

		this.assetForQRcode = this.assetData;
		this.assetCode1 = this.assetData.assetCode;

		setTimeout(() => {

			var html = document.getElementById('qrcode').innerHTML;
			let img64: string = html.substr(0, html.length - 2).split('base64,')[1];
			var dispimg64 = 'data:image/png;base64,' + img64;

			var doc = new jsPDF('l', 'mm', [470, 170]);

			//QRCODE img
			doc.addImage(dispimg64, '*', imageLeftMargin, allCompTopMargin, 50, 50);

			//TITLE
			doc.setFontSize(12);
			doc.setFontType("normal");
			doc.text(textLeftMargin, 8, 'Asset Title');

			doc.setFontSize(16);
			doc.setFontType("bold");
			doc.text(textLeftMargin, 14, this.assetForQRcode.assetTitle.length >= 25 ? (this.assetForQRcode.assetTitle.substring(0, 25) + ' ...') : this.assetForQRcode.assetTitle);

			//ASSETCODE
			doc.setFontSize(12);
			doc.setFontType("normal");
			doc.text(textLeftMargin, 25, 'AssetCode');

			doc.setFontSize(16);
			doc.setFontType("bold");
			doc.text(textLeftMargin, 31, this.assetForQRcode.assetCode);

			//MODELNO
			doc.setFontSize(12);
			doc.setFontType("normal");
			doc.text(textLeftMargin, 41, 'Model No.');

			doc.setFontSize(16);
			doc.setFontType("bold");
			doc.text(textLeftMargin, 47, this.assetForQRcode.modelNumber);

			window.open(doc.output('bloburl'), '_blank');
		}, 50);

	}

}
