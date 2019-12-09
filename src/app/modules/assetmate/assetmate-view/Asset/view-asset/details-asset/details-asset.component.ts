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

	viewAsset() {

		this.spinnerService.setSpinnerVisibility(true);
		this.assetmateService.viewAsset(this.assetId).subscribe(res => {
			this.spinnerService.setSpinnerVisibility(false);
			if (res.asset) {
				this.assetData = res.asset;
				this.assetcode = res.asset.assetCode;
				let arrSplittedUserGuidePath: string[] = res.asset.userGuideBook.split('.');
				this.userGuideFileExtension = arrSplittedUserGuidePath[arrSplittedUserGuidePath.length - 1];
				arrSplittedUserGuidePath = res.asset.userGuideBook.split('/');
				this.userGuideFileName = (arrSplittedUserGuidePath[arrSplittedUserGuidePath.length - 1]).split('.')[0];
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
		this.router.navigate([`/assetmate/assetmate-details/${this.categoryId}`]);
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
		console.log(file);
		const Ext = file.split('/').pop().split('?')[0]; // splits url into file name
		saveAs(file, Ext);
	}

	printQRcode() {

		this.assetForQRcode = this.assetData;
		this.assetCode1 = this.assetData.assetCode;

		setTimeout(() => {

			var html = document.getElementById('qrcode').innerHTML;
			let img64: string = html.substr(0, html.length - 2).split('base64,')[1];
			var dispimg64 = 'data:image/png;base64,' + img64;

			var doc = new jsPDF('l', 'mm', [390, 150]);

			//QRCODE img
			doc.addImage(dispimg64, '*', 2, 2, 50, 50);

			//TITLE
			doc.setFontSize(12);
			doc.setFontType("normal");
			doc.text(60, 8, 'Asset Title');

			doc.setFontSize(16);
			doc.setFontType("bold");
			doc.text(60, 14, this.assetForQRcode.assetTitle);

			//ASSETCODE
			doc.setFontSize(12);
			doc.setFontType("normal");
			doc.text(60, 25, 'AssetCode');

			doc.setFontSize(16);
			doc.setFontType("bold");
			doc.text(60, 31, this.assetForQRcode.assetCode);

			//MODELNO
			doc.setFontSize(12);
			doc.setFontType("normal");
			doc.text(60, 41, 'Model No.');

			doc.setFontSize(16);
			doc.setFontType("bold");
			doc.text(60, 47, this.assetForQRcode.modelNumber);

			window.open(doc.output('bloburl'), '_blank');
		}, 50);

	}

}
