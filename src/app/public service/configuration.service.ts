import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor() { }

   public static baseUrl = `http://13.233.115.55:8085/`;  //server side

  //  public static baseUrl = `http://192.168.0.112:4000/`;  //local

  
}
