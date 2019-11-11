import { Component, OnInit } from '@angular/core';
import { AssetmateService } from '../../../service/assetmate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from '../../../../../public service/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '../../../../../public service/spinner.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-view-checklist',
  templateUrl: './view-checklist.component.html',
  styleUrls: ['./view-checklist.component.css']
})
export class ViewChecklistComponent implements OnInit {


  pageNumber = 0;
  totalCount = 0;
  checklistData: any = [];
  showFirst: boolean = false;
  categoryId: any;
  public page: number = 0;
  categoryID: any;

  constructor(
    private assetmateService: AssetmateService,
    private router: Router,
    private route: ActivatedRoute,
    public dataService: DataSharingService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.categoryID = this.route.snapshot.params['categoryId'];
    this.getAllChecklists(this.categoryID, this.pageNumber);
  }

  /*********************************************************** Get All Checklists *******************************************************************/

  getAllChecklists(categoryId: number, pageNo: any) {

    this.spinnerService.setSpinnerVisibility(true);

    this.assetmateService.getAllChecklists(categoryId, pageNo).subscribe(res => {

      this.spinnerService.setSpinnerVisibility(false);

      if (res.ChecklistData) {
        this.checklistData = res.ChecklistData;
      } else {
        this.showSnackBar(res.message)
      }

    },
      error => {
        this.showSnackBar("Something went wrong..!!");
      }
    );
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  addChecklist() {
    this.showFirst = !this.showFirst;
    let selectedAsset = null;
    this.dataService.saveData(selectedAsset);
  }

  editChecklist(checklistId: number) {
    this.showFirst = !this.showFirst;
    this.dataService.saveData(checklistId);
  }

  /*********************************************************** Delete Particular Checklist *******************************************************************/
  deleteChecklist(checklistId: number) {
    alert('are you sure?');
    this.assetmateService.deleteChecklist(checklistId).subscribe(res => {
      this.toastr.success(res.message);
      this.getAllChecklists(this.categoryID, this.page);
    })
    error => {
      this.toastr.error(error.message);
    }
  }

  // checklistId(checklistId: any, page: any) {
  //   throw new Error("Method not implemented.");
  // }

  /*********************************************************** Search Particular Checklist ************************************************************/

  searchChecklist(keyword: any) {
    if (keyword) {
      this.assetmateService.searchChecklist(this.categoryID, keyword).subscribe((res: any) => {
        this.checklistData = res.data;


      },
        error => {
          console.log(error);
          this.toastr.error(error.error.errors[0].msg)

        })
    } else {
      this.getAllChecklists(this.categoryID, this.pageNumber);
    }

  }



}
