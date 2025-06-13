import {ElementRef, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {
  timeout,
  map,
  take,
  concat,
  share,
  delayWhen
} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AccessDataService {
  server: string;
  message:string = '';
  public locations = [];
  public brands = [];

  // public setting: any;
  public getProductFeatured: any;

  constructor(
    private http: HttpClient,
   ) {
    this.server = "https://localhost:8000/admin/api/";
  }

  postData(body:any, file:any) {
    const header = new HttpHeaders({
      'from-mobile' : "true",
      'Content-Type': 'application/json; charset=UTF-8'
    });
    const options = {
      headers: header
    };

    return this.http.post(this.server + file, JSON.stringify(body), options)
      .pipe(timeout(59000), map(res => res));
  }

  updateData(body:any, file:any) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    });
    const options = {
      headers: header
    };

    return this.http.put(this.server + file, JSON.stringify(body), options).pipe(timeout(59000), map(res => res)); // 59 sec timeout
  }

  getData(body:any, file:any) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    });
    let  paramsObj = new HttpParams();
    if (body) {

      for (const [key, value] of Object.entries(body)) {
        if (value) {
          paramsObj = paramsObj.set(key, value.toString());
        }
      }
    }

    const options = {
      headers: header,
      params: paramsObj
    };


    return this.http.get(this.server + file, options)
      .pipe(timeout(59000), map((res: any) => res));
  }

  deleteData(body:any, file:any) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    });
    let paramsObj;
    if (body) {
      for (const [key, value] of Object.entries(body)) {
        paramsObj = new HttpParams().set(key, (value as string).toString());
      }
    }
    const options = {
      headers: header,
      params: paramsObj
    };

    return this.http.delete(this.server + file, options)
      .pipe(timeout(59000));
  }


}
