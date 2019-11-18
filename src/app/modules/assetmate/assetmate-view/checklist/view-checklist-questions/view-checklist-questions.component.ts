import { Component, OnInit, ViewChild } from '@angular/core';
import { SpinnerService } from '../../../../../public service/spinner.service';
import { AssetmateService } from '../../../service/assetmate.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';

@Component({
  selector: 'app-view-checklist-questions',
  templateUrl: './view-checklist-questions.component.html',
  styleUrls: ['./view-checklist-questions.component.css']
})
export class ViewChecklistQuestionsComponent implements OnInit {

  checklistId: number;
  categoryId: number;
  checklistPrimaryInfo: any = {};
  pageNumber = 0;
  checklistQuestions: any = {};
  displayedColumns: string[] = ['questionType', 'questionDescription', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private assetmateService: AssetmateService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.checklistId = this.activatedRoute.snapshot.params['checkListId'];
    this.categoryId = this.activatedRoute.snapshot.params['categoryId'];
    this.getChecklistTitle(this.checklistId);
    this.subscribeToBadgeUpdateService();
  }

  subscribeToBadgeUpdateService() {
    this.assetmateService.getBadgeUpdateAction('questionList').subscribe(res => {
      if (res) {
        this.assetmateService.setBadgeUpdateAction('questionList', false);
        this.getChecklistTitle(this.checklistId);
      }
    });
  }

  getChecklistTitle(checklistId: number) {

    this.spinnerService.setSpinnerVisibility(true);
    this.assetmateService.getChecklistPrimaryInfoByChecklistId(checklistId).subscribe((resp: any) => {
      this.spinnerService.setSpinnerVisibility(false);
      if (resp.checklist) {
        this.checklistPrimaryInfo = resp.checklist;
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      }
    )

  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  backToList() {
    this.router.navigate(['/assetmate/assetmate-details/' + this.categoryId]);
  }

}
