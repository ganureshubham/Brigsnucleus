import { Component, OnInit, Inject } from '@angular/core';
import { DepartmentService } from '../../service/department.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material';

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


  constructor(private departmentService: DepartmentService,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dialog1: MatDialogRef<AddDepartmentComponent>,
    public dialogRef: MatDialogRef<AddDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log('blabla', this.data);
    this.deptId = this.data.parentId;


    if (this.data.type == 'Add') {
      console.log('if');

      this.deptData.parentId = this.data.parentId;

    } else if (this.data.type == 'Edit') {
      this.isEdited = true;
      this.formTitle = `Edit Department`;
      console.log('else if');

      this.deptData = this.data;
      // this.deptData.parentId = this.data.parentId;
      // this.deptData = this.data.node.parentId;
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
        console.log(error);
        this.toastr.error(error.message);

      })
  }

  /*********************************************************** Add New Department *******************************************************************/

  addDept(value) {
    this.departmentService.addDept(value).subscribe(res => {
      this.dialog.closeAll();
      this.toastr.success(res.message);

    },
      error => {
        console.log(error);
        this.toastr.error(error.message);

      })
  }

  editDept(value) {
    this.departmentService.editDept(this.deptId, value).subscribe(res => {
      console.log('edited', res);

      this.dialog.closeAll();
      this.toastr.success(res.message);

    },
      error => {
        console.log(error);
        this.toastr.error(error.message);

      })


  }


}
