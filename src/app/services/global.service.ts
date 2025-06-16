import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class GlobalService {

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize with user from localStorage
    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }
  }

  private getStoredUser() {
    const current_user = localStorage.getItem('user');
    try {
      return current_user ? JSON.parse(current_user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  }

  getCurrentUser(){
    return this.currentUserSubject.value;
  }

  getCurrentUser$(): Observable<any> {
    return this.currentUser$;
  }

  setCurrentUser(user: any) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    } else {
      localStorage.removeItem('user');
      this.currentUserSubject.next(null);
    }
  }

  getRole(){
    let currentUser = this.getCurrentUser();
    if (currentUser && currentUser.role){
      return currentUser.role.name;
    } else {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  logout() {
    this.setCurrentUser(null);
  }

}
