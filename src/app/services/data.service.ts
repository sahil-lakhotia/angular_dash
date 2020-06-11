import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


import { Observable } from 'rxjs';

import { of } from 'rxjs';

import {Data_Batch} from '../model/data_batch';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  // data_url:string="https://gist.githubusercontent.com/Vvgupta/e3f80bd308929c59376906968bec9545/raw/7bfc3237a8c941a3d2ca82d1678862c7a38dcbae/view-1+2_primary.json";

  data_url:string="https://gist.githubusercontent.com/Vvgupta/e3f80bd308929c59376906968bec9545/raw/9cfe6ceff58b5b45d4fdbde4fa164aed6bd69bf2/view-1+2_primary_2.json";
  data_url_rbt:string="https://gist.githubusercontent.com/Vvgupta/9420f699a96a5fa0ce3545da365a3bf0/raw/cbafb94929b583af37e76b2e8f9f3d87a5f27c43/view-3_primary.json";

  constructor(private http:HttpClient) { }

  getdata(): Observable<Data_Batch[]>{
    return this.http.get<Data_Batch[]>(this.data_url)
  }

async agetdata(){
    return await this.http.get<Data_Batch[]>(this.data_url).toPromise()
  }

async agetdata_rbt(){
    return await this.http.get<Data_Batch[]>(this.data_url_rbt).toPromise()
  }
 
}
