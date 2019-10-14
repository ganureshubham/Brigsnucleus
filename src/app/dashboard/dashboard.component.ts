import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../public service/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading: boolean;
  rows:any={};

  constructor(private toastr:ToastrService,private notificationService:NotificationService) { }

  ngOnInit() {
    this.getStatus();
  }



  getStatus(){
    this.loading = true;
    this.notificationService.getDashboardDetails().subscribe(res=>{
      console.log(res);
      this.rows=res.dashboard[0];
      
    })

    
  } 

}
