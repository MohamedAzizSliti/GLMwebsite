import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiDebugService } from '../../services/api-debug.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-auth-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card mt-3" *ngIf="showDebug">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h6 class="mb-0">🔧 Authentication Debug Panel</h6>
        <button class="btn btn-sm btn-outline-secondary" (click)="toggleDebug()">
          {{ showDetails ? 'Hide' : 'Show' }} Details
        </button>
      </div>
      <div class="card-body" *ngIf="showDetails">
        <div class="row">
          <div class="col-md-6">
            <h6>Authentication Status</h6>
            <div class="mb-2">
              <span class="badge" [ngClass]="authStatus.isAuthenticated ? 'bg-success' : 'bg-danger'">
                {{ authStatus.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated' }}
              </span>
            </div>
            <div *ngIf="authStatus.user" class="mb-2">
              <small class="text-muted">User: {{ authStatus.user.name || authStatus.user.email || 'Unknown' }}</small>
            </div>
            <div *ngIf="authStatus.token" class="mb-2">
              <small class="text-muted">Token: {{ authStatus.token.substring(0, 20) }}...</small>
            </div>
          </div>
          <div class="col-md-6">
            <h6>API Configuration</h6>
            <div class="mb-2">
              <small class="text-muted">API URL: {{ apiUrl }}</small>
            </div>
            <button class="btn btn-sm btn-primary me-2" (click)="testApiConnection()">
              Test API Connection
            </button>
            <button class="btn btn-sm btn-warning" (click)="clearAuth()">
              Clear Auth Data
            </button>
          </div>
        </div>
        
        <div *ngIf="testResult" class="mt-3">
          <h6>API Test Result</h6>
          <div class="alert" [ngClass]="testResult.success ? 'alert-success' : 'alert-danger'">
            {{ testResult.message }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-left: 4px solid #007bff;
    }
    .badge {
      font-size: 0.8rem;
    }
  `]
})
export class AuthDebugComponent implements OnInit {
  authStatus: any = {};
  apiUrl = environment.apiUrl;
  showDebug = false;
  showDetails = false;
  testResult: any = null;

  constructor(
    private apiDebugService: ApiDebugService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.updateAuthStatus();
    
    // Show debug panel in development mode or if there are auth issues
    this.showDebug = !environment.production || !this.authStatus.isAuthenticated;
  }

  updateAuthStatus(): void {
    this.authStatus = this.apiDebugService.checkAuthStatus();
  }

  toggleDebug(): void {
    this.showDetails = !this.showDetails;
  }

  testApiConnection(): void {
    this.testResult = null;
    
    // Test a simple API endpoint
    this.http.get(`${this.apiUrl}/self`).subscribe({
      next: (response) => {
        this.testResult = {
          success: true,
          message: '✅ API connection successful! Authentication is working.'
        };
      },
      error: (error) => {
        this.apiDebugService.logApiError(error, 'self');
        this.testResult = {
          success: false,
          message: `❌ API Error: ${this.apiDebugService.getErrorMessage(error)}`
        };
      }
    });
  }

  clearAuth(): void {
    localStorage.removeItem('user');
    this.updateAuthStatus();
    this.testResult = {
      success: true,
      message: '🗑️ Authentication data cleared. Please log in again.'
    };
  }
} 