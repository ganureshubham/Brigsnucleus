import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DepartmentService } from '../service/department.service';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { DialogData } from '../../../app.component';


interface DepartmentNode {
  departmentId: number;
  departmentTitle: String;
  childData?: DepartmentNode[];
  parentId: number;
}

interface departmentDialogData {
  type: string;
  level: number;
  parentId: number;
  departmentTitle: string;
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
  selector: 'app-department-view',
  templateUrl: './department-view.component.html',
  styleUrls: ['./department-view.component.css'],
})
export class DepartmentViewComponent implements OnInit {

  departmentId;
  animal: any;
  TREE_DATA: DepartmentNode[];
  local_TREE_DATA: DepartmentNode[];
  final_TREE_DATA: DepartmentNode[];
  isTreeDataReady: boolean = false;
  dialogData: departmentDialogData;


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
    private departmentService: DepartmentService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    //this.categoryID = this.route.snapshot.params['categoryId'];
    this.getAllDept();
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;






  getAllDept() {
    this.departmentService.getAllDept().subscribe(res => {
      if (res.department) {
        // console.log('TREE DATA:');
        // console.log(res);
        this.TREE_DATA = res.department;
        this.dataSource.data = this.TREE_DATA;
        this.isTreeDataReady = true;
      }
    },
      error => {
        console.log(error.error.message);
      })
  }

  addDept(node: any): void {
    console.log('bak', node);


    this.dialogData = {

      type: 'Add',
      level: node.level,
      parentId: node.parentId,
      departmentTitle: node.name

    }

    const dialogRef = this.dialog.open(AddDepartmentComponent, {

      data: this.dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllDept();
    });
  }


  editDept(node: any) {
    console.log('edit', node);


    this.dialogData = {

      type: 'Edit',
      level: node.level,
      parentId: node.parentId,
      departmentTitle: node.name

    }
    const dialogRef = this.dialog.open(AddDepartmentComponent, {
      data: this.dialogData

    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllDept();
    });

  }



}






