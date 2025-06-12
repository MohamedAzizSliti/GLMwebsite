import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TimerService } from '../../services/timer.service';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  standalone:true,
  imports: [
    CommonModule
  ],
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  formattedTime$: Observable<string>;
  isRunning$: Observable<boolean>;

  constructor(private timerService: TimerService) {
    this.formattedTime$ = this.timerService.getFormattedTime();
    this.isRunning$ = this.timerService.isRunning$;
  }

  ngOnInit(): void {
    // Le composant est prêt à afficher le temps
  }

  ngOnDestroy(): void {
    // Pas besoin de désabonnement car nous utilisons l'async pipe dans le template
  }
}
