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

  
  private saveDataSource  = new BehaviorSubject<any>('null');
  mSaveData = this.saveDataSource.asObservable();

  constructor() { }

  changeData(data:any){
    this.dataSource.next(data);
  }
  
  saveData(data:any){
    this.saveDataSource.next(data);
  }

  aciveState(state:string){
    this.activeStateData.next(state); 
  }

}
