import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-test-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="card">
        <div class="card-header">
          <h3>🧪 Test Upload & Authentication</h3>
        </div>
        <div class="card-body">
          
          <!-- User Info -->
          <div class="mb-4">
            <h5>👤 Current User Info</h5>
            <div class="alert alert-info">
              <pre>{{ userInfo | json }}</pre>
            </div>
          </div>

          <!-- File Upload Test -->
          <div class="mb-4">
            <h5>📤 Test File Upload</h5>
            <input type="file" 
                   (change)="onFileSelected($event)" 
                   accept="image/*"
                   class="form-control mb-3">
            
            <button class="btn btn-primary" 
                    (click)="testUpload()" 
                    [disabled]="!selectedFile || isUploading">
              {{ isUploading ? 'Uploading...' : 'Test Upload' }}
            </button>
          </div>

          <!-- Results -->
          <div class="mb-4" *ngIf="uploadResult">
            <h5>📊 Upload Result</h5>
            <div class="alert" [ngClass]="uploadResult.success ? 'alert-success' : 'alert-danger'">
              <pre>{{ uploadResult | json }}</pre>
            </div>
          </div>

          <!-- Token Info -->
          <div class="mb-4">
            <h5>🔑 Token Info</h5>
            <div class="alert alert-secondary">
              <p><strong>Token exists:</strong> {{ hasToken ? 'Yes' : 'No' }}</p>
              <p><strong>Token preview:</strong> {{ tokenPreview }}</p>
            </div>
          </div>

          <!-- Test Buttons -->
          <div class="d-flex gap-2">
            <button class="btn btn-info" (click)="refreshUserInfo()">
              🔄 Refresh User Info
            </button>
            <button class="btn btn-warning" (click)="clearResults()">
              🗑️ Clear Results
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    pre {
      white-space: pre-wrap;
      word-break: break-all;
    }
    .gap-2 {
      gap: 0.5rem;
    }
  `]
})
export class TestUploadComponent {
  userInfo: any = null;
  selectedFile: File | null = null;
  isUploading = false;
  uploadResult: any = null;
  hasToken = false;
  tokenPreview = '';

  constructor(
    private apiService: ApiService,
    private globalService: GlobalService
  ) {
    this.refreshUserInfo();
  }

  refreshUserInfo() {
    // Get user from GlobalService
    this.userInfo = this.globalService.getCurrentUser();
    
    // Check token
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.hasToken = !!user.access_token;
        this.tokenPreview = user.access_token ? 
          user.access_token.substring(0, 20) + '...' : 
          'No token';
      } catch (error) {
        this.hasToken = false;
        this.tokenPreview = 'Error parsing token';
      }
    } else {
      this.hasToken = false;
      this.tokenPreview = 'No user data in localStorage';
    }

    console.log('User info refreshed:', {
      userInfo: this.userInfo,
      hasToken: this.hasToken,
      tokenPreview: this.tokenPreview
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('File selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  }

  testUpload() {
    if (!this.selectedFile) {
      alert('Please select a file first');
      return;
    }

    this.isUploading = true;
    this.uploadResult = null;

    console.log('Starting upload test...');
    console.log('File:', this.selectedFile);
    console.log('User:', this.userInfo);

    this.apiService.uploadMedia(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Upload successful:', response);
        this.uploadResult = {
          success: true,
          data: response,
          timestamp: new Date().toISOString()
        };
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.uploadResult = {
          success: false,
          error: {
            status: error.status,
            statusText: error.statusText,
            message: error.error?.message || error.message,
            url: error.url
          },
          timestamp: new Date().toISOString()
        };
      },
      complete: () => {
        this.isUploading = false;
      }
    });
  }

  clearResults() {
    this.uploadResult = null;
    this.selectedFile = null;
  }
}
