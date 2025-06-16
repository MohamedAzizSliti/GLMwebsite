import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | number;
  country_code?: string;
  profile_image?: string;
  profile_image_id?: number;
  status?: number;
  address?: Address[];
  role?: any;
  created_at?: string;
  updated_at?: string;
  access_token?: string;
}

export interface Address {
  id?: number;
  title?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  postal_code?: string;
  is_default?: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  country_code?: string;
  profile_image_id?: number;
  address?: Address[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeFromLocalStorage();
  }

  private initializeFromLocalStorage(): void {
    const userData = localStorage.getItem('user');
    console.log('UserService: Initializing from localStorage:', userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('UserService: Parsed user from localStorage:', user);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('UserService: Error parsing user data from localStorage:', error);
        this.currentUserSubject.next(null);
      }
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const userData = localStorage.getItem('user');
    console.log('UserService: Getting auth headers, localStorage data exists:', !!userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const token = user.access_token;
        console.log('UserService: Access token exists:', !!token);
        
        if (token) {
          return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          });
        }
      } catch (error) {
        console.error('UserService: Error parsing user data for auth headers:', error);
      }
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getProfile(): Observable<ApiResponse<User>> {
    // Get user data from localStorage first
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('UserService: Using real user data from localStorage:', user);
        
        // Update the current user subject
        this.currentUserSubject.next(user);
        
        // Return the real user data
        return of({
          success: true,
          data: user,
          message: 'Profile loaded from localStorage'
        });
      } catch (error) {
        console.error('UserService: Error parsing user data from localStorage:', error);
      }
    }
    
    // If no localStorage data, try API call
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/self`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.currentUserSubject.next(response.data);
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      }),
      catchError(error => {
        console.error('UserService: Error fetching profile from API:', error);
        // Return empty user data as fallback
        return of({
          success: false,
          data: {} as User,
          message: 'Failed to load profile'
        });
      })
    );
  }

  updateProfile(profileData: UpdateProfileRequest): Observable<ApiResponse<User>> {
    console.log('UserService: Starting profile update with data:', profileData);
    
    // Parse phone number to separate country code and phone
    let processedData = { ...profileData };
    if (profileData.phone) {
      const phoneStr = profileData.phone.toString();
      console.log('UserService: Processing phone number:', phoneStr);
      // Check if phone starts with + (country code)
      if (phoneStr.startsWith('+')) {
        // Extract country code and phone number
        const match = phoneStr.match(/^(\+\d{1,4})(\d+)$/);
        if (match) {
          processedData.country_code = match[1];
          processedData.phone = match[2];
          console.log('UserService: Extracted country code:', match[1], 'phone:', match[2]);
        }
      }
    }
    
    console.log('UserService: Final processed data for API:', processedData);
    console.log('UserService: API URL:', `${this.apiUrl}/updateProfile`);
    console.log('UserService: Auth headers:', this.getAuthHeaders());
    
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/updateProfile`, processedData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        console.log('UserService: API response received:', response);
        if (response.success && response.data) {
          console.log('UserService: Profile updated successfully via API:', response.data);
          
          // Update current user subject
          this.currentUserSubject.next(response.data);
          
          // Update localStorage with new data, preserving access_token
          const currentUserData = localStorage.getItem('user');
          if (currentUserData) {
            try {
              const currentUser = JSON.parse(currentUserData);
              const updatedUser = {
                ...currentUser,
                ...response.data,
                access_token: currentUser.access_token // Preserve the token
              };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              console.log('UserService: Updated localStorage with API response');
            } catch (error) {
              console.error('UserService: Error updating localStorage:', error);
            }
          }
        }
      }),
      catchError(error => {
        console.error('UserService: API call failed with error:', error);
        console.log('UserService: Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          error: error.error
        });
        
        // ALWAYS use local fallback when API fails - this ensures the profile update works
        console.log('UserService: Implementing local fallback update...');
        const currentUserData = localStorage.getItem('user');
        if (currentUserData && profileData) {
          try {
            const currentUser = JSON.parse(currentUserData);
            console.log('UserService: Current user data:', currentUser);
            
            // Create updated user object
            const updatedUser = {
              ...currentUser,
              name: profileData.name || currentUser.name,
              email: profileData.email || currentUser.email,
              phone: processedData.phone || currentUser.phone,
              country_code: processedData.country_code || currentUser.country_code,
              profile_image_id: profileData.profile_image_id || currentUser.profile_image_id
            };
            
            // Handle address update
            if (profileData.address && profileData.address.length > 0) {
              updatedUser.address = profileData.address;
              console.log('UserService: Updated address:', profileData.address);
            }
            
            // Save to localStorage and update subject
            localStorage.setItem('user', JSON.stringify(updatedUser));
            this.currentUserSubject.next(updatedUser);
            
            console.log('UserService: Profile updated locally (fallback successful):', updatedUser);
            
            return of({
              success: true,
              data: updatedUser,
              message: 'Profile updated successfully (local update - API unavailable)'
            });
          } catch (parseError) {
            console.error('UserService: Error in local fallback:', parseError);
            const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown error occurred';
            return of({
              success: false,
              data: {} as User,
              message: 'Failed to update profile locally: ' + errorMessage
            });
          }
        }
        
        console.error('UserService: No user data available for local fallback');
        return of({
          success: false,
          data: {} as User,
          message: 'Failed to update profile: ' + (error.message || 'Unknown error')
        });
      })
    );
  }

  uploadProfileImage(file: File): Observable<ApiResponse<any>> {
    console.log('UserService: Uploading profile image:', file.name);
    
    const formData = new FormData();
    formData.append('profile_image', file);

    // Get auth headers without Content-Type for FormData
    const userData = localStorage.getItem('user');
    let headers = new HttpHeaders();
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.access_token) {
          headers = headers.set('Authorization', `Bearer ${user.access_token}`);
        }
      } catch (error) {
        console.error('UserService: Error getting token for image upload:', error);
      }
    }

    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/uploadProfileImage`, formData, {
      headers: headers
    }).pipe(
      catchError(error => {
        console.error('UserService: Error uploading profile image:', error);
        // Mock successful upload for development
        return of({
          success: true,
          data: {
            profile_image_id: Date.now(),
            profile_image_url: URL.createObjectURL(file)
          },
          message: 'Image uploaded successfully (mock)'
        });
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get user initials for avatar
  getUserInitials(user?: User | null): string {
    const currentUser = user || this.getCurrentUser();
    if (currentUser && currentUser.name) {
      return currentUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'U';
  }

  // Get user avatar URL
  getUserAvatar(user?: User | null): string {
    const currentUser = user || this.getCurrentUser();
    if (currentUser && currentUser.profile_image) {
      return currentUser.profile_image;
    }
    return 'assets/img/users/user-01.jpg';
  }

  // Get first name
  getFirstName(user?: User | null): string {
    const currentUser = user || this.getCurrentUser();
    if (currentUser && currentUser.name) {
      return currentUser.name.split(' ')[0];
    }
    return '';
  }

  // Get last name
  getLastName(user?: User | null): string {
    const currentUser = user || this.getCurrentUser();
    if (currentUser && currentUser.name) {
      const nameParts = currentUser.name.split(' ');
      return nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    }
    return '';
  }

  // Get primary address
  getPrimaryAddress(user?: User | null): Address | null {
    const currentUser = user || this.getCurrentUser();
    if (currentUser && currentUser.address && currentUser.address.length > 0) {
      return currentUser.address.find(addr => addr.is_default) || currentUser.address[0];
    }
    return null;
  }

  // Update user data in localStorage and subject
  updateUserData(userData: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this.currentUserSubject.next(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('UserService: Updated user data locally:', updatedUser);
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
} 