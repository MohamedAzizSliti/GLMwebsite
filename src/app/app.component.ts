import { Component, OnInit } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart } from '@angular/router';
import { CommonService } from './shared/common/common.service';
import { AccessDataService } from './services/access-data.service';
import { url } from './shared/models/models';
import { setTheme } from 'ngx-bootstrap/utils';
import { CongratulationsData } from './shared/components/congratulations-modal/congratulations-modal.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'SmartHR';
  base = '';
  page = '';
  last = '';
  
  // Congratulations modal data
  showCongratulationsModal = false;
  congratulationsData: CongratulationsData | null = null;
  
  constructor(
    private common: CommonService,
    private router: Router,
    private accessDataService: AccessDataService
  ) {
    setTheme('bs5');
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
    this.router.events.subscribe((data: RouterEvent) => {
      if (data instanceof NavigationStart) {
        this.getRoutes(data);
      }
    });
  }
  
  ngOnInit(): void {
    // Check for pending congratulations when app loads
    this.checkForCongratulations();
  }
  
  private checkForCongratulations(): void {
    // Only check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      return;
    }
    
    this.accessDataService.getData({}, 'check-congratulations').subscribe({
      next: (response) => {
        if (response && response.success && response.has_pending && response.congratulations.length > 0) {
          // Show congratulations for the first pending certification
          const firstCongratulation = response.congratulations[0];
          this.congratulationsData = {
            enrollment_id: firstCongratulation.id,
            course: firstCongratulation.course,
            average_score: firstCongratulation.average_score || 0,
            quizzes_completed: firstCongratulation.quizzes_completed || 0,
            total_quizzes: firstCongratulation.total_quizzes || 0,
            certification_date: firstCongratulation.certification_date
          };
          this.showCongratulationsModal = true;
        }
      },
      error: (error) => {
        console.error('Error checking congratulations:', error);
        // Silently fail - don't show error to user for this background check
      }
    });
  }
  
  public getRoutes(events: url) {
    const splitVal = events.url.split('/');
    this.common.base.next(splitVal[1]);
    this.common.page.next(splitVal[2]);
    this.common.last.next(splitVal[3]);
  }
  
  onCongratulationsClose(): void {
    this.showCongratulationsModal = false;
    this.congratulationsData = null;
    
    // Check for more pending congratulations after closing
    setTimeout(() => {
      this.checkForCongratulations();
    }, 1000);
  }
  
  onFeedbackSubmitted(): void {
    // Feedback submitted successfully
  }
}
