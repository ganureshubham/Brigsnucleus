import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../../service/role.service';
import { DataSharingService } from '../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  isEdited: boolean = false;
  formTitle: string = "Add User Role";
  roleData: any = {};
  uploadingLoader: boolean = false;

  constructor(private router: Router,
    private roleService: RoleService,
    public dataService: DataSharingService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.dataService.currentData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        console.log("ngonit function", res);
        this.roleData.title = res.title;
        this.roleData.userRoleId = res.userRoleId;
        this.isEdited = true;
        this.formTitle = `Edit User Role`;

      }
    })

  }

  /*********************************************************** Add New Asset *******************************************************************/
  addRole(value) {
    this.uploadingLoader = true;
    this.roleService.addRole(value).subscribe(res => {
      console.log(res);
      this.uploadingLoader = false;
      this.toastr.success(res.message);
      this.router.navigate(['/user-role']); 

    },
      error => {
        this.uploadingLoader = false;
        console.log(error);
        this.toastr.error(error.message);

      })


  }

  /*********************************************************** Edit Selected Role *******************************************************************/

  editRole(value) {


    this.roleService.editRole(this.roleData.userRoleId, value).subscribe(res => {
      console.log(res);
      this.toastr.success(res.message);
      this.router.navigate(['/user-role']);

    },
      error => {
        console.log();

      })


  }



  /*********************************************************** Back to role list *******************************************************************/

  backToList() {
    this.router.navigate(['/user-role']);

  }

  /*********************************************************** Back to role list *******************************************************************/

  add() {
    this.router.navigate(['/user-role']);
  }

}
