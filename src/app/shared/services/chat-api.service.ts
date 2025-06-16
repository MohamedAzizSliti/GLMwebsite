import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// API Response interfaces
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ConversationResponse {
  id: number;
  name?: string;
  type: 'private' | 'group';
  participants: any[];
  latest_message?: any;
  unread_count?: number;
  created_at: string;
  updated_at: string;
}

interface MessageResponse {
  id: number;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio';
  file_path?: string;
  user: any;
  conversation_id: number;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {
  private apiUrl = environment.apiUrl || 'http://localhost:8000/api';
  private readonly TIMEOUT_MS = 10000; // 10 seconds timeout
  private readonly RETRY_COUNT = 2;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('ChatApiService Error:', error);
    
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
          break;
        case 403:
          errorMessage = 'Accès refusé.';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée.';
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  private makeRequest<T>(request: Observable<T>): Observable<T> {
    return request.pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_COUNT),
      catchError(this.handleError.bind(this))
    );
  }

  // Get all conversations for current user
  getConversations(): Observable<ApiResponse<ConversationResponse[]>> {
    // Since chat routes don't exist in Laravel backend, immediately return mock data
    return of({
      success: false,
      data: [],
      message: 'Chat routes not implemented - using mock data'
    });
  }

  // Get messages for a specific conversation
  getMessages(conversationId: number, page: number = 1): Observable<ApiResponse<MessageResponse[]>> {
    // Since chat routes don't exist in Laravel backend, immediately return mock data
    return of({
      success: false,
      data: [],
      message: 'Chat routes not implemented - using mock data'
    });
  }

  // Send a new message
  sendMessage(conversationId: number, content: string, type: string = 'text', file?: File): Observable<ApiResponse<MessageResponse>> {
    // Since chat routes don't exist in Laravel backend, immediately return mock data
    return of({
      success: false,
      data: {} as MessageResponse,
      message: 'Chat routes not implemented - using mock data'
    });
  }

  // Create or get conversation with specific user
  createConversationWithUser(userId: number): Observable<ApiResponse<ConversationResponse>> {
    // Since chat routes don't exist in Laravel backend, immediately return mock data
    return of({
      success: false,
      data: {} as ConversationResponse,
      message: 'Chat routes not implemented - using mock data'
    });
  }

  // Search users
  searchUsers(query: string): Observable<ApiResponse<any[]>> {
    const params = new HttpParams().set('q', query);
    return this.makeRequest(
      this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/users/search`, { params })
    );
  }

  // Mark messages as read
  markAsRead(conversationId: number): Observable<ApiResponse<any>> {
    return this.makeRequest(
      this.http.post<ApiResponse<any>>(`${this.apiUrl}/conversations/${conversationId}/read`, {})
    );
  }

  // Delete message
  deleteMessage(messageId: number): Observable<ApiResponse<any>> {
    return this.makeRequest(
      this.http.delete<ApiResponse<any>>(`${this.apiUrl}/messages/${messageId}`)
    );
  }

  // Edit message
  editMessage(messageId: number, content: string): Observable<ApiResponse<MessageResponse>> {
    return this.makeRequest(
      this.http.put<ApiResponse<MessageResponse>>(`${this.apiUrl}/messages/${messageId}`, {
        content: content
      })
    );
  }

  // Upload file
  uploadFile(file: File): Observable<ApiResponse<{file_path: string}>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.makeRequest(
      this.http.post<ApiResponse<{file_path: string}>>(`${this.apiUrl}/upload`, formData)
    );
  }

  // Search messages within a conversation
  searchMessages(conversationId: number, query: string): Observable<ApiResponse<MessageResponse[]>> {
    const params = new HttpParams().set('q', query);
    return this.makeRequest(
      this.http.get<ApiResponse<MessageResponse[]>>(`${this.apiUrl}/conversations/${conversationId}/search`, { params })
    );
  }

  // Get conversation details
  getConversation(conversationId: number): Observable<ApiResponse<ConversationResponse>> {
    return this.makeRequest(
      this.http.get<ApiResponse<ConversationResponse>>(`${this.apiUrl}/conversations/${conversationId}`)
    );
  }

  // Refresh messages (for manual refresh functionality)
  refreshMessages(conversationId: number): Observable<ApiResponse<MessageResponse[]>> {
    // Since chat routes don't exist in Laravel backend, immediately return mock data
    return of({
      success: false,
      data: [],
      message: 'Chat routes not implemented - using mock data'
    });
  }
} 