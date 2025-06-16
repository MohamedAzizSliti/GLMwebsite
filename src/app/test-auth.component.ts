import { Component } from '@angular/core';
import { JsonPipe, NgIf } from '@angular/common';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-test-auth',
  standalone: true,
  imports: [JsonPipe, NgIf],
  template: `
    <div style="padding: 20px;">
      <h3>Test Authentication</h3>
      <button (click)="testAuth()" class="btn btn-primary">Test Auth</button>
      <div *ngIf="result" style="margin-top: 20px;">
        <h4>Result:</h4>
        <pre>{{ result | json }}</pre>
      </div>
      <div style="margin-top: 20px;">
        <h4>LocalStorage User:</h4>
        <pre>{{ getUserFromStorage() | json }}</pre>
      </div>
    </div>
  `
})
export class TestAuthComponent {
  result: any = null;

  constructor(private apiService: ApiService) {}

  testAuth() {
    console.log('Testing authentication...');
    
    // Test simple course creation
    const testCourse = {
      title: 'Test Course',
      description: 'Test Description',
      category_id: 1
    };

    this.apiService.createCompleteCourse(testCourse).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.result = { success: true, data: response };
      },
      error: (error) => {
        console.error('Error:', error);
        this.result = { success: false, error: error };
      }
    });
  }

  getUserFromStorage() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
}
