import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { UserService } from '../service/user.service';


interface DepartmentNode {
  departmentId: number;
  departmentTitle: String;
  childData?: DepartmentNode[];
  parentId: number;
}



/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  departmentId: number;
  level: number;
  parentId: number;
}

@Component({
  selector: 'app-department-filter',
  templateUrl: './department-filter.component.html',
  styleUrls: ['./department-filter.component.css']
})
export class DepartmentFilterComponent implements OnInit {


  animal: any;
  departmentId: number;
  TREE_DATA: DepartmentNode[];
  local_TREE_DATA: DepartmentNode[];
  final_TREE_DATA: DepartmentNode[];
  isTreeDataReady: boolean = false;
  isAlreadySubscribedToDialogUserActionService: boolean = false;


  private transformer = (node: DepartmentNode, level: number) => {
    return {
      expandable: !!node.childData && node.childData.length > 0,
      name: node.departmentTitle,
      departmentId: node.departmentId,
      parentId: node.parentId,
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
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    //this.categoryID = this.route.snapshot.params['categoryId'];
    this.getAllDepts();
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;





  /***************************************** Get ALl Departments************************************************************************/

  // loadAllCategories() {

  //   this.assetmateService.filterCategoryList().subscribe(res => {
  //     if (res) {
  //       // console.log('TREE DATA:');
  //       // console.log(res);
  //       this.TREE_DATA = res.assetCategory;
  //       this.final_TREE_DATA = [...this.TREE_DATA];
  //       this.dataSource.data = this.TREE_DATA;
  //       this.isTreeDataReady = true;
  //     }
  //   },
  //     error => {
  //       console.log(error.error.message);
  //     })

  // }

  // handleCategoryTreeNodeClick(node) {
  //   this.router.navigate([`/assetmate/assetmate-details/${node.categoryId}`]).then(() => {
  //     location.reload();
  //   })
  // }


  getAllDepts() {
    this.userService.getAllDepts().subscribe(res => {
      console.log(res);

      if (res.department) {
        this.TREE_DATA = res.department;
        this.final_TREE_DATA = [...this.TREE_DATA];
        this.dataSource.data = this.TREE_DATA;
        this.isTreeDataReady = true;
      }
    },
      error => {
        console.log(error);

      })
  }

  handleCategoryTreeNodeClick(node) {
    this.router.navigate([`/user/user-list/${node.departmentId}`]).then(() => {
      location.reload();
    })
  }







  // onSearchCategoryTxtChange(searchedText: string) {
  //   // console.log(searchedText);

  //   this.local_TREE_DATA = [...this.TREE_DATA];
  //   // console.log(this.TREE_DATA);
  //   // console.log(this.local_TREE_DATA);

  //   if (searchedText.length == 0) {
  //     this.TREE_DATA = [];
  //     this.TREE_DATA = [...this.final_TREE_DATA];
  //     // console.log('Length 0');
  //     // console.log(this.local_TREE_DATA);
  //     // console.log(this.TREE_DATA);
  //     this.dataSource.data = this.TREE_DATA;
  //   } else {
  //     for (let i = 0; i < this.TREE_DATA.length; i++) {
  //       // console.log(this.TREE_DATA[i].title + ' - ' + searchedText);
  //       // console.log(this.local_TREE_DATA);
  //       if (
  //         this.TREE_DATA[i].title.includes(searchedText) ||
  //         this.TREE_DATA[i].title.includes(searchedText.toLowerCase()) ||
  //         this.TREE_DATA[i].title.includes(searchedText.toUpperCase())
  //       ) {
  //         this.TREE_DATA = [];
  //         this.TREE_DATA.push(this.local_TREE_DATA[i]);
  //         this.dataSource.data = this.TREE_DATA;
  //         // console.log('Length > 0');
  //         // console.log(this.dataSource.data)
  //         break;
  //       }
  //     }
  //   }

  // }

}