import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { routes } from '../../../shared/routes/routes';
import { UserService, User } from '../../../shared/services/user.service';

@Component({
  selector: 'app-my-profile',
  standalone: false,
  
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit, OnDestroy {
  public routes = routes;
  public user: User | null = null;
  public loading = false;
  public error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserProfile(): void {
    this.loading = true;
    this.error = null;

    this.userService.getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.user = response.data;
          } else {
            this.error = response.message || 'Failed to load profile';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to load profile. Please try again.';
          console.error('Error loading profile:', error);
        }
      });
  }

  getUserAvatar(): string {
    return this.userService.getUserAvatar(this.user);
  }

  getUserInitials(): string {
    return this.userService.getUserInitials(this.user);
  }

  getFirstName(): string {
    if (this.user?.name) {
      return this.user.name.split(' ')[0];
    }
    return '';
  }

  getLastName(): string {
    if (this.user?.name) {
      const nameParts = this.user.name.split(' ');
      return nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    }
    return '';
  }

  getPrimaryAddress() {
    if (this.user?.address && this.user.address.length > 0) {
      return this.user.address.find(addr => addr.is_default) || this.user.address[0];
    }
    return null;
  }

  refreshProfile(): void {
    this.loadUserProfile();
  }
}
