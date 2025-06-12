import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private durationInMinutes = 0;
  private timerSubscription: Subscription | null = null;
  private remainingTimeSubject = new BehaviorSubject<number>(0);
  private isRunningSubject = new BehaviorSubject<boolean>(false);

  remainingTime$ = this.remainingTimeSubject.asObservable();
  isRunning$ = this.isRunningSubject.asObservable();

  constructor() { }

  /**
   * Démarre le minuteur avec la durée spécifiée en minutes
   * @param durationInMinutes Durée du quiz en minutes
   */
  startTimer(durationInMinutes: number): void {
    this.stopTimer(); // Arrête tout minuteur existant
    
    this.durationInMinutes = durationInMinutes;
    const totalSeconds = durationInMinutes * 60;
    this.remainingTimeSubject.next(totalSeconds);
    this.isRunningSubject.next(true);

    this.timerSubscription = interval(1000)
      .pipe(
        takeWhile(() => this.remainingTimeSubject.getValue() > 0)
      )
      .subscribe(() => {
        const currentValue = this.remainingTimeSubject.getValue();
        this.remainingTimeSubject.next(currentValue - 1);
        
        if (currentValue <= 1) {
          this.stopTimer();
        }
      });
  }

  /**
   * Arrête le minuteur
   */
  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
    this.isRunningSubject.next(false);
  }

  /**
   * Réinitialise le minuteur
   */
  resetTimer(): void {
    this.stopTimer();
    this.remainingTimeSubject.next(0);
  }

  /**
   * Vérifie si le temps est écoulé
   */
  isTimeUp(): boolean {
    return this.remainingTimeSubject.getValue() <= 0;
  }

  /**
   * Formate le temps restant en format mm:ss
   */
  getFormattedTime(): Observable<string> {
    return this.remainingTime$.pipe(
      map(seconds => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      })
    );
  }
}
