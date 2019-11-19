import { Component, OnInit, Inject } from '@angular/core';
import { DepartmentService } from '../../service/department.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../../../public service/spinner.service';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent implements OnInit {
  deptData: any = {};
  deptList: any;
  parentId: any;
  isEdited: boolean = false;
  formTitle: string = "Add Department";
  deptId: any;
  dialogInputData: any;
  savebtn = 1;
  cancelbtn = 0;


  constructor(
    private departmentService: DepartmentService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dialog1: MatDialogRef<AddDepartmentComponent>,
    public dialogRef: MatDialogRef<AddDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit() {

    this.deptId = this.data.parentId;
    if (this.data.type == 'Add') {
      if (this.data.level > 0) {
        this.deptData.parentId = this.data.departmentId;
      } else {
        this.deptData.parentId = this.data.parentId;
      }
    } else if (this.data.type == 'Edit') {
      this.isEdited = true;
      this.formTitle = `Edit Department`;
      this.deptData = this.data;
    } else if (this.data.type == 'New Add') {
      this.deptData.parentId = this.data.parentId;
    }

    this.getDeptList();

  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  onNoClick() { }

  /*********************************************************** Get Department List *******************************************************************/

  getDeptList() {
    this.departmentService.getDeptList().subscribe(res => {
      if (res.department) {
        this.deptList = res.department;
      }
    },
      error => {
        this.showSnackBar("Something went wrong..!!");

      })
  }

  /*********************************************************** Add New Department *******************************************************************/

  addDept(value) {
    value.parentId = this.deptData.parentId;
    this.spinnerService.setSpinnerVisibility(true);
    this.departmentService.addDept(value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  /*********************************************************** Update particular Department *******************************************************************/

  editDept(value) {

    value.parentId = this.deptData.parentId;
    this.spinnerService.setSpinnerVisibility(true);
    this.departmentService.editDept(this.deptData.departmentId, value).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      this.showSnackBar(res.message);
      this.dialog.closeAll();
    },
      error => {

        this.showSnackBar("Something went wrong..!!");
      })
  }



}
