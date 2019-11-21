import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../service/profile.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  profile: any = {}

  constructor(private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getProfile();
  }

  /*********************************** Get Profile Data************************************************************************************** */

  getProfile() {
    this.profileService.getProfile().subscribe(res => {
      // console.log(JSON.stringify(data.adminProfile));
      let data: any = res;
      if (data.adminProfile) {
        this.profile = data.adminProfile;
      }
    },
      error => {
        this.showSnackBar('Something went wrong..!!');
      })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }
} 
