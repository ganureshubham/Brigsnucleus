import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetCategoryService } from '../service/asset-category.service';
import { SpinnerService } from '../../../public service/spinner.service';
import { DialogService } from '../../../public service/dialog.service';
import { AddAssetCategoryComponent } from './add-asset-category/add-asset-category.component';
import { AppDialogData } from '../../../model/appDialogData';

interface AssetCategoryNode {
  categoryId: number;
  title: String;
  childData?: AssetCategoryNode[];
  parentId: number;
}

interface departmentDialogData {
  type: string;
  level: number;
  parentId: number;
  categoryId: number;
  title: string;
}



/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  categoryId: number;
  level: number;
  parentId: number;
}

@Component({
  selector: 'app-asset-category-view',
  templateUrl: './asset-category-view.component.html',
  styleUrls: ['./asset-category-view.component.css']
})
export class AssetCategoryViewComponent implements OnInit {


  animal: any;
  categoryId: number;
  TREE_DATA: AssetCategoryNode[];
  local_TREE_DATA: AssetCategoryNode[];
  final_TREE_DATA: AssetCategoryNode[];
  isTreeDataReady: boolean = false;
  dialogData: departmentDialogData;
  isAlreadySubscribedToDialogUserActionService: boolean = false;


  private transformer = (node: AssetCategoryNode, level: number) => {
    return {
      expandable: !!node.childData && node.childData.length > 0,
      name: node.title,
      categoryId: node.categoryId,
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
    private assetCategoryService: AssetCategoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private dialogService: DialogService
  ) {
  }

  ngOnInit() {
    //this.categoryID = this.route.snapshot.params['categoryId'];
    this.getAllAssetCategoryLists();
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  isNoRecord() {
    return this.dataSource.data.length == 0;
  }


  /************************************* All Department Lists****************************************************************/

  getAllAssetCategoryLists() {
    this.spinnerService.setSpinnerVisibility(true);

    this.assetCategoryService.getAllAssetCategoryLists().subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.assetCategory) {
        this.TREE_DATA = res.assetCategory;
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


  openDialog(): void {


    this.dialogData = {
      type: 'New Add',
      level: 0,
      parentId: 0,
      categoryId: 0,
      title: ''
    }

    const dialogRef = this.dialog.open(AddAssetCategoryComponent, {
      data: this.dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllAssetCategoryLists();
    });

  }

  /************************************* Add New Asset Category****************************************************************/


  addAssetCategory(node: any): void {

    this.dialogData = {
      type: 'Add',
      level: node.level,
      parentId: node.parentId,
      categoryId: node.categoryId,
      title: node.name
    }

    const dialogRef = this.dialog.open(AddAssetCategoryComponent, {
      data: this.dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllAssetCategoryLists();
      }
    });
  }

  /************************************* Edit Particular Asset Category****************************************************************/


  editAssetCategory(node: any) {
    this.dialogData = {

      type: 'Edit',
      level: node.level,
      parentId: node.parentId,
      categoryId: node.categoryId,
      title: node.name

    }
    const dialogRef = this.dialog.open(AddAssetCategoryComponent, {
      data: this.dialogData

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.getAllAssetCategoryLists();
      }

    });

  }

  /************************************* Delete Particular Asset Category****************************************************************/


  deleteAssetCategory(categoryId: number, name: string) {
    this.categoryId = categoryId;
    let appDialogData: AppDialogData = {
      visibilityStatus: true,
      title: 'DELETE ASSET CATEGORY',
      message: ` Are your sure you want to delete Asset Category "${name}"?`,
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
          this.assetCategoryService.deleteAssetCategory(this.categoryId).subscribe(res => {
            this.spinnerService.setSpinnerVisibility(false);
            this.showSnackBar(res.message);
            this.getAllAssetCategoryLists();
          }, error => {
            this.showSnackBar("Something went wrong..!!");
          });
        }
      })
    }
  }



}