import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DepartmentService } from '../service/department.service';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { DialogData } from '../../../app.component';
import { SpinnerService } from '../../../public service/spinner.service';
import { DialogService } from '../../../public service/dialog.service';
import { AppDialogData } from '../../../model/appDialogData';

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
  departmentId: number;
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


  animal: any;
  departmentId: number;
  TREE_DATA: DepartmentNode[];
  local_TREE_DATA: DepartmentNode[];
  final_TREE_DATA: DepartmentNode[];
  isTreeDataReady: boolean = false;
  dialogData: departmentDialogData;
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
    private departmentService: DepartmentService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private dialogService: DialogService
  ) {
  }

  ngOnInit() {
    //this.categoryID = this.route.snapshot.params['categoryId'];
    this.getAllDept();
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;




  /************************************* All Department Lists****************************************************************/

  getAllDept() {
    this.spinnerService.setSpinnerVisibility(true);

    this.departmentService.getAllDept().subscribe(res => {
      console.log(res);


      this.spinnerService.setSpinnerVisibility(false);

      if (res.department) {
        this.TREE_DATA = res.department;
        this.dataSource.data = this.TREE_DATA;
        this.isTreeDataReady = true;
      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /************************************* Add New Department****************************************************************/


  addDept(node: any): void {

    this.dialogData = {
      type: 'Add',
      level: node.level,
      parentId: node.parentId,
      departmentId: node.departmentId,
      departmentTitle: node.name
    }

    const dialogRef = this.dialog.open(AddDepartmentComponent, {
      data: this.dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllDept();
      }
    });
  }

  getParentId(node) {

    if (node.level > 0) {
      return node.departmentId;

    } else {
      return node.parentId;
    }

  }


  /************************************* Edit Particular Department****************************************************************/


  editDept(node: any) {
    this.dialogData = {

      type: 'Edit',
      level: node.level,
      parentId: node.parentId,
      departmentId: node.departmentId,
      departmentTitle: node.name

    }
    const dialogRef = this.dialog.open(AddDepartmentComponent, {
      data: this.dialogData

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllDept();
      }

    });

  }

  getParentId1(node) {

    if (node.level > 0) {
      return node.parentId;
    } else {
      return node.departmentId;
    }

  }


  /************************************* Delete Particular Department****************************************************************/


  deleteDept(departmentId: number, name: string) {
    this.departmentId = departmentId;

    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE DEPARTMENT',
      message: ` Are your sure you want to delete department "${name}"?`,
      positiveBtnLable: "Yes",
      negativeBtnLable: "Cancel"
    }
    this.dialogService.setDialogVisibility(appDialogData);
    if (!this.isAlreadySubscribedToDialogUserActionService) {
      this.isAlreadySubscribedToDialogUserActionService = true;
      this.dialogService.getUserDialogAction().subscribe(userAction => {
        if (userAction == 0) {
          //User has not performed any action on opened app dialog or closed the dialog;
        } else if (userAction == 1) {
          this.dialogService.setUserDialogAction(0);
          //User has approved delete operation
          this.spinnerService.setSpinnerVisibility(true);
          this.departmentService.deleteDept(this.departmentId).subscribe(res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.getAllDept();
          }, error => {
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }
  }



}






