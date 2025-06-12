import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GlobalService {

  constructor(private http: HttpClient) {}


  getCurrentUser(){
    const current_user = localStorage.getItem('user');

   return  current_user ? JSON.parse(current_user) : null;
  }

  getRole(){
    let currentUser = this.getCurrentUser();
    if (currentUser){
      return currentUser.role.name;
    }else {
      return  null ;
    }
  }

}
