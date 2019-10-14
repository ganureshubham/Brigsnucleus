import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../service/alert.service';
import { DataSharingService } from '../../../../public service/data-sharing.service';

@Component({
  selector: 'app-alert-details',
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.css']
})
export class AlertDetailsComponent implements OnInit {
  alertData:any={};

  constructor(private router: Router, private alertService: AlertService, private dataService: DataSharingService) { }

  ngOnInit() { 
    this.dataService.currentData.subscribe(res => {
      if (res != null && res != "null" && res != "null") {
        
        this.viewAlert(res);
        
       
      }
    })
  }

  viewAlert(alertId:number){
    this.alertService.viewAlert(alertId).subscribe(res=>{
      console.log('view Function',res);
      

    })

  }

}
