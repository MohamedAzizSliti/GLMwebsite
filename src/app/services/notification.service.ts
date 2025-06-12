import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public alertSubject = new Subject();

  public notification: boolean = true;

  constructor(private zone: NgZone,
    private http: HttpClient,
     private toastr: ToastrService) { }

  showSuccess(message: string): void {
    this.alertSubject.next({type: 'success', message: message});
    this.zone.run(() => {

      if(this.notification) {
        this.toastr.success(message);
      }
    });
  }

  showError(message: string): void {
    this.alertSubject.next({type: 'error', message: message});
      this.zone.run(() => {
        if(this.notification) {
          this.toastr.error(message);
        }
      });
  }


}
