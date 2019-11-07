import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../service/profile.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  profile: any = {}

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe(res => {
      // console.log(JSON.stringify(data.adminProfile));
      let data: any = res;
      this.profile = data.adminProfile;
    })
  }
}
