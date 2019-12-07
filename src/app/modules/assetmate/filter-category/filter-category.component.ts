import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AssetmateService } from '../service/assetmate.service';

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
		private assetmateService: AssetmateService
	) {
	}

	ngOnInit() {
		this.categoryID = this.route.snapshot.params['categoryId'];
		this.loadAllCategories();
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

}
