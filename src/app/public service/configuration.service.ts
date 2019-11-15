import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor() { }

  // public static baseUrl = `http://13.127.6.128:8085/`;  //server side

  public static baseUrl = `http://192.168.0.115:4001/`;  //local-Ajay

  // public static baseUrl = `http://192.168.0.166:8082/`;  //local-Harshad

}
