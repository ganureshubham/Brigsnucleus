import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../service/department.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent implements OnInit {
  deptData:any={};
  deptList:any;
  constructor(private departmentService:DepartmentService,
    private router:Router,
    private toastr:ToastrService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.getDeptList();
  }

  closeDialog():void {
    this.dialog.closeAll();

  }

  onNoClick(){}

  /*********************************************************** Get Department List *******************************************************************/

  getDeptList(){
    this.departmentService.getDeptList().subscribe(res=>{
      if(res.department){
        this.deptList=res.department;
      }
    },
    error =>{
      console.log(error);
      this.toastr.error(error.message);
      
    })
  } 

  /*********************************************************** Add New Department *******************************************************************/

  addDept(value){
    this.departmentService.addDept(value).subscribe(res=>{
      console.log(res);
      this.toastr.success(res.message);
      
    },
    error =>{
      console.log(error);
      this.toastr.error(error.message);
      
    })
  }

}
