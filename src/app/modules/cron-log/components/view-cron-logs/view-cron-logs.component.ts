import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatTableDataSource, MatPaginator } from '@angular/material';
import { SpinnerService } from '../../../../public service/spinner.service';
import { CronLogService } from '../../service/cron-log.service';

interface Cronlog {
  typeOfCron: string;
  executionStart: string;
  executionEnd: string;
  comment: string;
}

@Component({
  selector: 'app-view-cron-logs',
  templateUrl: './view-cron-logs.component.html',
  styleUrls: ['./view-cron-logs.component.css']
})
export class ViewCronLogsComponent implements OnInit {

  count: number;
  pageNumber = 0;
  totalCount = 0;
  page: number = 0;
  isNoRecordFound: boolean = false;

  dataSource: MatTableDataSource<Cronlog> = new MatTableDataSource();

  displayedColumns: string[] = ['typeOfCron', 'executionStart', 'executionEnd', 'comment'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private cronLogService: CronLogService
  ) { }

  ngOnInit() {
    this.getCronLogsList(this.pageNumber);
  }

  /***************************************** Get List Of Cron Logs *******************************************************************************/

  getCronLogsList(pageNo: number) {
    this.spinnerService.setSpinnerVisibility(true);
    this.cronLogService.getCronLogsList(pageNo).subscribe(res => {
      this.spinnerService.setSpinnerVisibility(false);
      if (res.status) {
        if (res.currentPage == 0 && res.totalCount == 0) {
          this.isNoRecordFound = true;
          this.showSnackBar(res.message);
        } else {
          this.isNoRecordFound = false;
        }
        this.dataSource = res.cronJobs;
        this.pageNumber = res.currentPage;
        this.totalCount = res.totalCount;
      } else {
        this.showSnackBar(res.message);
      }
    },
      error => {
        this.spinnerService.setSpinnerVisibility(false);
        this.showSnackBar("Something went wrong..!!");
      })
  }

  pageChange(pageNo: any) {
    this.page = pageNo.pageIndex;
    this.getCronLogsList(this.page);
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

}
