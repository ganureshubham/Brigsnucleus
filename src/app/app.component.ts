import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './public service/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'brigsnucleus';
  shouldSpinnerVisible : boolean = false;

  constructor(private spinnerService: SpinnerService){  
  }

  ngOnInit(){
    this.subscribeToSpinnerService();
  }

  subscribeToSpinnerService(){
    this.spinnerService.showSpinner.subscribe(result => {
      this.shouldSpinnerVisible = result; 
    });
  }

}
