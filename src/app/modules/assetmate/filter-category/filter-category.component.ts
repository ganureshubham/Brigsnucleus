import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AssetmateService } from '../service/assetmate.service';

interface CategoryNode {
  categoryId: number;
  title: String;
  children?: CategoryNode[];
}

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
// interface FoodNode {
//   name: string;
//   categoryId: number;
//   children?: FoodNode[];
// }

// const TREE_DATA: FoodNode[] = [
//   {
//     name: 'Fruit',
//     categoryId: 1,
//     children: [
//       {
//         name: 'Apple',
//         categoryId: 1
//       },
//       {
//         name: 'Banana',
//         categoryId: 1
//       },
//       {
//         name: 'Fruit loops',
//         categoryId: 1
//       },
//     ]
//   },
//  {
//   name: 'Vegetables',
//   children: [
//     {
//       name: 'Green',
//       children: [
//         {
//           name: 'Green-in',
//           children: [
//             { name: 'Broccoli' },
//             { name: 'Brussel sprouts' },
//           ]
//         }
//       ]
//     }, {
//       name: 'Orange',
//       children: [
//         { name: 'Pumpkins' },
//         { name: 'Carrots' },
//       ]
//     },
//   ]
// },
// ];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
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
  TREE_DATA: CategoryNode[];
  isTreeDataReady: boolean = false;

  private transformer = (node: CategoryNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.title,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
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
      console.log("Category Tree data");
      console.log(res);
      this.TREE_DATA = res.rootCategory;
      this.dataSource.data = this.TREE_DATA;
      this.isTreeDataReady = true;
      // if (res && res.data) {
      //   this.category = res.data; 
      // }
    },
      error => {
        console.log(error.error.message);
      })

  }

}