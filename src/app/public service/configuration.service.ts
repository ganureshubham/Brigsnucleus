import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ConfigurationService {

	constructor() { }
	// public static baseUrl = `http://15.206.181.222:8085/`;  //server side
	public static baseUrl = `http://13.127.22.216:8085/`;  //local
	//public static baseUrl = `http://192.168.0.126:7001/`;  //local-Ajay
	//public static baseUrl = `http://192.168.0.114:8082/`;  //local-Harshad 

}