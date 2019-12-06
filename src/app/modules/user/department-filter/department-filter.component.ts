import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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


  @Output() messageEvent = new EventEmitter<string>();

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

  getAllDepts() {
    this.userService.getAllDepts().subscribe(res => {
      if (res.department) {
        this.TREE_DATA = res.department;
        this.final_TREE_DATA = [...this.TREE_DATA];
        this.dataSource.data = this.TREE_DATA;
        this.isTreeDataReady = true;
        this.messageEvent.emit(res.department[0]);
      }
    },
      error => {
        console.log(error);
      })
  }

  handleCategoryTreeNodeClick(node) {
    console.log('node', node);

    this.messageEvent.emit(node);
    // this.router.navigate([`/user/user-list/${node.departmentId}`]).then(() => {
    //   location.reload();
    // })
  }

  /***************************************** Search  Departments************************************************************************/

  onSearchCategoryTxtChange(searchedText: string) {
    if (searchedText.length == 0) {
      this.TREE_DATA = [];
      this.local_TREE_DATA = [];
      this.TREE_DATA = [...this.final_TREE_DATA];
      this.dataSource.data = this.TREE_DATA;
    } else {
      this.dataSource.data = this.TREE_DATA.filter(d => d.departmentTitle.toLocaleLowerCase().indexOf(searchedText.toLocaleLowerCase()) > -1);
    }
  }


}