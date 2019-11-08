import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private showSpinnerSource = new BehaviorSubject<boolean>(false);
  showSpinner = this.showSpinnerSource.asObservable()

  constructor() {
  }

  setSpinnerVisibility(shouldSpinnerVisible: boolean) {
    this.showSpinnerSource.next(shouldSpinnerVisible);
  }

}
