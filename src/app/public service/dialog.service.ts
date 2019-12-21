import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';
import { AppDialogData } from '../model/appDialogData';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private showDialogSource = new BehaviorSubject<AppDialogData>({
    visibilityStatus: false,
    title: '',
    message: '',
    positiveBtnLable: '',
    negativeBtnLable: '',
    action: ''
  });

  private userDialogAction = new BehaviorSubject<number>(0);

  constructor() {
  }

  setDialogVisibility(shouldDialogVisible: AppDialogData) {
    this.showDialogSource.next(shouldDialogVisible);
  }

  getDialogVisibility(): Observable<AppDialogData> {
    return this.showDialogSource.asObservable();
  }

  getUserDialogAction(): Observable<number> {
    return this.userDialogAction.asObservable();
  }

  setUserDialogAction(userAction: number) {
    this.userDialogAction.next(userAction);
  }

}
