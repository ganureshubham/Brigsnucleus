import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private dataSource  = new BehaviorSubject<any>('null');
  currentData = this.dataSource.asObservable();


  private activeStateData  = new BehaviorSubject<any>('null');
  currentActive = this.activeStateData.asObservable();
  constructor() { }

  changeData(data:any){
    this.dataSource.next(data);
  }

  aciveState(state:string){
    this.activeStateData.next(state); 
  }

}
