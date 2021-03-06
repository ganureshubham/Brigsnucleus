import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AssetmateService } from '../service/assetmate.service';
import { SpinnerService } from 'src/app/public service/spinner.service';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

interface CategoryNode {
	categoryId: number;
	title: String;
	childData?: CategoryNode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
	expandable: boolean;
	name: string;
	categoryId: number;
	level: number;
}

interface Filter {
	installationLocationTypeIdFK: [];
	manufacturerIdFK: [];
	supplierIdFK: [];
	departmentIdFK: [];
}

/****************************************End filter****************************************/
@Component({
	selector: 'app-filter-category',
	templateUrl: './filter-category.component.html',
	styleUrls: ['./filter-category.component.css'],
})
export class FilterCategoryComponent implements OnInit {

	categoryID;
	TREE_DATA: CategoryNode[] = [];
	local_TREE_DATA: CategoryNode[] = [];
	final_TREE_DATA: CategoryNode[] = [];
	isTreeDataReady: boolean = false;

	arrAssetInstallationLocation: any = [];
	arrAssetManufacturer: any = [];
	arrAssetSupplier: any = [];
	arrAssetDepartment: any = [];

	filterFormGroup: FormGroup;
	filterBadge = 0;

	private transformer = (node: CategoryNode, level: number) => {
		return {
			expandable: !!node.childData && node.childData.length > 0,
			name: node.title,
			categoryId: node.categoryId,
			level: level,
		};
	}

	treeControl = new FlatTreeControl<ExampleFlatNode>(
		node => node.level, node => node.expandable);

	treeFlattener = new MatTreeFlattener(
		this.transformer, node => node.level, node => node.expandable, node => node.childData);

	dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private assetmateService: AssetmateService,
		private spinnerService: SpinnerService,
		private snackBar: MatSnackBar,
		private formBuilder: FormBuilder,
	) {
	}

	ngOnInit() {
		this.categoryID = this.route.snapshot.params['categoryId'];
		this.loadAllCategories();
		this.getfilterDropDownValues();
		this.setFormControls();
		this.subscribeToFilterDataService();
	}

	subscribeToFilterDataService() {
		this.assetmateService.getFilterCriteria().subscribe(
			resp => {

				this.filterFormGroup.get('locationType').setValue(resp.locationType);
				this.filterFormGroup.get('manufacturer').setValue(resp.manufacturer);
				this.filterFormGroup.get('supplier').setValue(resp.supplier);
				this.filterFormGroup.get('department').setValue(resp.department);

				this.filterBadge = 0;

				if (resp.locationType.length == 0) {
					this.filterFormGroup.get('locationType').setErrors(null);
				} else {
					this.filterBadge++;
				}
				if (resp.manufacturer.length == 0) {
					this.filterFormGroup.get('manufacturer').setErrors(null);
				} else {
					this.filterBadge++;
				}
				if (resp.supplier.length == 0) {
					this.filterFormGroup.get('supplier').setErrors(null);
				} else {
					this.filterBadge++;
				}
				if (resp.department.length == 0) {
					this.filterFormGroup.get('department').setErrors(null);
				} else {
					this.filterBadge++;
				}

			}
		);
	}

	setFormControls() {
		this.filterFormGroup = this.formBuilder.group({
			locationType: [''],
			manufacturer: [''],
			supplier: [''],
			department: ['']
		});
	}

	getfilterDropDownValues() {
		this.getAllAssetInstallationLocationTypes();
	}

	getAllAssetInstallationLocationTypes() {
		this.spinnerService.setSpinnerVisibility(true);
		this.assetmateService.getLocationList().subscribe(res => {
			this.getManufacturerList()
			if (res.installationLocationType) {
				this.arrAssetInstallationLocation = res.installationLocationType;
				/* this.arrAssetInstallationLocation.push(
					{
						installationLocationTypeIdFK: 0,
						title: "All"
					}
				); */
			} else {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar(res.message);
			}
		},
			error => {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar("Something went wrong..!!");
			})
	}

	getManufacturerList() {
		this.assetmateService.getManufList().subscribe(res => {
			this.getsupplierList()
			if (res.manufacturerList) {
				this.arrAssetManufacturer = res.manufacturerList;
				/* this.arrAssetManufacturer.push(
					{
						manufacturerId: 0,
						title: "All"
					}
				); */
			} else {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar(res.message);
			}
		},
			error => {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar("Something went wrong..!!");
			}
		);

	}

	getsupplierList() {
		this.assetmateService.getsuppList().subscribe(res => {
			this.getDepartmentList();
			if (res.supplierList) {
				this.arrAssetSupplier = res.supplierList;
				/* this.arrAssetSupplier.push(
					{
						supplierId: 0,
						supplierName: "All"
					}
				); */
			} else {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar(res.message);
			}
		},
			error => {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar("Something went wrong..!!");
			}
		);
	}

	getDepartmentList() {
		this.assetmateService.getDeptList().subscribe(res => {
			if (res.department) {
				this.arrAssetDepartment = res.department;
				/* this.arrAssetDepartment.push(
					{
						departmentId: 0,
						departmentTitle: "All"
					}
				); */
				this.spinnerService.setSpinnerVisibility(false);
			} else {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar(res.message);
			}
		},
			error => {
				this.spinnerService.setSpinnerVisibility(false);
				this.showSnackBar("Something went wrong..!!");
			}
		);
	}

	hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

	loadAllCategories() {

		this.assetmateService.filterCategoryList().subscribe(res => {
			if (res) {
				this.TREE_DATA = res.assetCategory;
				this.final_TREE_DATA = [...this.TREE_DATA];
				this.dataSource.data = this.TREE_DATA;
				this.isTreeDataReady = true;
			}
		},
			error => {
				console.log(error.error.message);
			})

	}

	handleCategoryTreeNodeClick(node) {
		this.router.navigate([`/assetmate/assetmate-details/${node.categoryId}`]).then(() => {
			location.reload();
		})
	}

	onSearchCategoryTxtChange(searchedText: string) {
		if (searchedText.length == 0) {
			this.TREE_DATA = [];
			this.local_TREE_DATA = [];
			this.TREE_DATA = [...this.final_TREE_DATA];
			this.dataSource.data = this.TREE_DATA;
		} else {
			this.dataSource.data = this.TREE_DATA.filter(d => d.title.toLocaleLowerCase().indexOf(searchedText.toLocaleLowerCase()) > -1);
		}

	}

	filterUpdated() {

		this.filterBadge = 0;

		if (this.filterFormGroup.get('locationType').value.length == 0) {
			this.filterFormGroup.get('locationType').setErrors(null);
		} else {
			this.filterBadge++;
		}

		if (this.filterFormGroup.get('manufacturer').value.length == 0) {
			this.filterFormGroup.get('manufacturer').setErrors(null);
		} else {
			this.filterBadge++;
		}

		if (this.filterFormGroup.get('supplier').value.length == 0) {
			this.filterFormGroup.get('supplier').setErrors(null);
		} else {
			this.filterBadge++;
		}

		if (this.filterFormGroup.get('department').value.length == 0) {
			this.filterFormGroup.get('department').setErrors(null);
		} else {
			this.filterBadge++;
		}

		let filterData: Filter = {
			installationLocationTypeIdFK: this.filterFormGroup.get('locationType').value,
			manufacturerIdFK: this.filterFormGroup.get('manufacturer').value,
			supplierIdFK: this.filterFormGroup.get('supplier').value,
			departmentIdFK: this.filterFormGroup.get('department').value,
		}

		this.assetmateService.setFilterCriteria(filterData);

	}

	clearAllFilters() {

		if (
			this.filterFormGroup.get('locationType').value.length == 0 &&
			this.filterFormGroup.get('manufacturer').value.length == 0 &&
			this.filterFormGroup.get('supplier').value.length == 0 &&
			this.filterFormGroup.get('department').value.length == 0
		) {
			this.showSnackBar('No filter criteria to clear..!!');
		} else {
			let filterData: Filter = {
				installationLocationTypeIdFK: [],
				manufacturerIdFK: [],
				supplierIdFK: [],
				departmentIdFK: []
			}
			this.filterFormGroup.get('locationType').setErrors(null);
			this.filterFormGroup.get('manufacturer').setErrors(null);
			this.filterFormGroup.get('supplier').setErrors(null);
			this.filterFormGroup.get('department').setErrors(null);
			this.assetmateService.setFilterCriteria(filterData);
		}

	}

	showSnackBar(message: string) {
		this.snackBar.open(message, '', { duration: 2000 });
	}

}
