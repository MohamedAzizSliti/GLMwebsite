import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { routes } from '../../../shared/routes/routes';
import { ChatApiService } from '../../../shared/services/chat-api.service';
import { TranslationService } from '../../../services/translation.service';

// Types pour la messagerie
interface User {
  id: number;
  name: string;
  email?: string;
  profile_image?: string;
  is_online?: boolean;
  last_seen?: string;
  role?: {
    id: number;
    name: string;
  };
}

interface Message {
  id: number;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio';
  file_path?: string;
  user: User;
  conversation_id: number;
  created_at: string;
  updated_at: string;
  is_edited?: boolean;
  edited_at?: string;
  status?: 'sending' | 'sent' | 'failed';
  retry_count?: number;
}

interface Conversation {
  id: number;
  name?: string;
  type: 'private' | 'group';
  participants: User[];
  latest_message?: {
    content: string;
    created_at: string;
    user_name: string;
  };
  unread_count?: number;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  public routes = routes;
  public isSearch = false;
  public isOpen = false;

  // État de la messagerie
  conversations: Conversation[] = [];
  currentConversation: Conversation | null = null;
  messages: Message[] = [];
  typingUsers: Set<number> = new Set();
  onlineUsers: Set<number> = new Set();
  loading = false;
  sendingMessage = false;
  errorMessage: string | null = null;

  // Formulaires
  messageForm: FormGroup;
  searchForm: FormGroup;
  searchResults: User[] = [];
  isSearching = false;

  // Conversation storage for persistence
  private conversationStorage = new Map<string, {conversation: Conversation, messages: Message[]}>();

  // Fichiers
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;

  // État de l'interface
  showUserSearch = false;
  isMobileView = false;
  showConversationList = true;
  isDirectChatMode = false; // Mode chat direct depuis "Chat Now"

  private destroy$ = new Subject<void>();
  private shouldScrollToBottom = true;
  private currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private chatApiService: ChatApiService,
    private translationService: TranslationService
  ) {
    this.messageForm = this.fb.group({
      content: [{value: '', disabled: true}, [Validators.maxLength(1000)]]
    });

    this.searchForm = this.fb.group({
      query: ['', [Validators.required, Validators.minLength(2)]]
    });

    // Obtenir l'ID de l'utilisateur actuel
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user.id || null;
  }

  ngOnInit(): void {
    this.checkMobileView();
    this.setupSearch();

    // Vérifier si on doit créer une conversation avec un utilisateur spécifique
    this.route.queryParams.subscribe(params => {
      if (params['userId']) {
        const userId = parseInt(params['userId']);
        const userName = params['userName'] || 'Utilisateur';
        // Mode chat direct activé
        this.isDirectChatMode = true;
        this.showConversationList = false; // Masquer la liste sur mobile
        // Si on a des paramètres userId/userName, on charge seulement cette conversation
        this.createConversationWithUser(userId, userName);
      } else {
        // Mode normal - afficher toutes les conversations
        this.isDirectChatMode = false;
        this.showConversationList = true;
        this.loadConversations();
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Méthodes héritées de l'ancien composant
  isEmoji(): void {
    this.isOpen = !this.isOpen;
  }

  openSearch(): void {
    this.isSearch = !this.isSearch;
  }

  // Méthodes de messagerie
  private checkMobileView(): void {
    this.isMobileView = window.innerWidth < 768;
  }

  private setupSearch(): void {
    this.searchForm.get('query')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        if (query && query.length >= 2) {
          this.searchUsers(query);
        } else {
          this.searchResults = [];
        }
      });
  }

  private loadConversations(): void {
    this.loading = true;
    
    this.chatApiService.getConversations()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading conversations:', error);
          // Fallback to mock data if API fails
          this.loadMockData();
          return of(null);
        })
      )
      .subscribe(response => {
        this.loading = false;
        if (response && response.success) {
          this.conversations = response.data;
          
          // Sélectionner la première conversation par défaut
          if (this.conversations.length > 0) {
            this.selectConversation(this.conversations[0]);
          }
        }
      });
  }

  private loadMockData(): void {
    // Données de démonstration basées sur l'interface existante
    this.conversations = [
      {
        id: 1,
        type: 'private',
        participants: [
          { id: 1, name: 'Mohamed Rakrouki', is_online: true },
          { id: 2, name: 'Ryhem Kochti', is_online: true }
        ],
        latest_message: {
          content: 'Merci encore, à demain !',
          created_at: '2024-03-25T11:15:00Z',
          user_name: 'Ryhem Kochti'
        },
        unread_count: 0,
        created_at: '2024-03-25T09:00:00Z',
        updated_at: '2024-03-25T11:15:00Z'
      },
      {
        id: 2,
        type: 'private',
        participants: [
          { id: 3, name: 'Ahmed Slimani', is_online: false },
          { id: 2, name: 'Current User', is_online: true }
        ],
        latest_message: {
          content: 'Avez-vous reçu le devoir ?',
          created_at: '2024-03-25T12:00:00Z',
          user_name: 'Ahmed Slimani'
        },
        unread_count: 2,
        created_at: '2024-03-25T10:00:00Z',
        updated_at: '2024-03-25T12:00:00Z'
      },
      {
        id: 3,
        type: 'private',
        participants: [
          { id: 4, name: 'Fatma Hamdi', is_online: true },
          { id: 2, name: 'Current User', is_online: true }
        ],
        latest_message: {
          content: 'Vidéo',
          created_at: '2024-03-25T11:55:00Z',
          user_name: 'Fatma Hamdi'
        },
        unread_count: 0,
        created_at: '2024-03-25T08:00:00Z',
        updated_at: '2024-03-25T11:55:00Z'
      }
    ];

    // Sélectionner la première conversation par défaut
    if (this.conversations.length > 0) {
      this.selectConversation(this.conversations[0]);
    }
  }

  private searchUsers(query: string): void {
    this.isSearching = true;

    this.chatApiService.searchUsers(query)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error searching users:', error);
          // Fallback to mock search
          return of({
            success: true,
            data: [
              { id: 5, name: 'Karim Ben Ali', email: 'karim@example.com', is_online: false },
              { id: 6, name: 'Leila Trabelsi', email: 'leila@example.com', is_online: true },
              { id: 7, name: 'Sami Bouazizi', email: 'sami@example.com', is_online: true }
            ].filter(user =>
              user.name.toLowerCase().includes(query.toLowerCase()) ||
              user.email?.toLowerCase().includes(query.toLowerCase())
            )
          });
        })
      )
      .subscribe(response => {
        this.isSearching = false;
        if (response && response.success) {
          this.searchResults = response.data;
        }
      });
  }

  selectConversation(conversation: Conversation): void {
    // Save current conversation and messages before switching
    if (this.currentConversation) {
      this.saveConversationToStorage(this.currentConversation, this.messages);
    }

    this.currentConversation = conversation;
    this.loadMessages(conversation.id);

    // Enable message input when conversation is selected
    this.messageForm.get('content')?.enable();

    if (this.isMobileView) {
      this.showConversationList = false;
    }
  }

  private loadMessages(conversationId: number): void {
    this.loading = true;

    // Check if we have stored messages for this conversation
    const conversationKey = `conv_${conversationId}`;
    const storedData = this.conversationStorage.get(conversationKey);
    
    if (storedData) {
      // Load from storage
      this.messages = storedData.messages;
      this.loading = false;
      this.shouldScrollToBottom = true;
      return;
    }

    // Check if this is a mock conversation (ID > 1000000000000 means it's a timestamp)
    if (conversationId > 1000000000000) {
      // This is a mock conversation, load mock messages directly
      this.loadMockMessages(conversationId);
      return;
    }

    this.chatApiService.getMessages(conversationId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading messages:', error);
          // Fallback to mock data if API fails
          this.loadMockMessages(conversationId);
          return of(null);
        })
      )
      .subscribe(response => {
        this.loading = false;
        if (response && response.success) {
          this.messages = response.data.map(msg => ({
            ...msg,
            status: 'sent'
          }));
        }
        this.shouldScrollToBottom = true;
      });
  }

  private loadMockMessages(conversationId: number): void {
    // Simulation du chargement des messages
    setTimeout(() => {
      if (conversationId === 1) {
        this.messages = [
          {
            id: 1,
            content: 'Bonjour Monsieur Rakrouki, j\'ai un peu de mal à comprendre certains points en HTML. Est-ce que vous pourriez m\'aider s\'il vous plaît ?',
            type: 'text',
            user: { id: 2, name: 'Ryhem Kochti' },
            conversation_id: 1,
            created_at: '2024-03-25T09:45:00Z',
            updated_at: '2024-03-25T09:45:00Z'
          },
          {
            id: 2,
            content: 'Bonjour Ryhem, pas de souci. Tu peux me dire exactement ce que tu ne comprends pas ?',
            type: 'text',
            user: { id: 1, name: 'Mohamed Rakrouki' },
            conversation_id: 1,
            created_at: '2024-03-25T10:47:00Z',
            updated_at: '2024-03-25T10:47:00Z'
          },
          {
            id: 3,
            content: 'C\'est surtout la structure des balises et comment les utiliser correctement dans une page web. J\'ai lu le cours mais je me sens encore un peu perdue.',
            type: 'text',
            user: { id: 2, name: 'Ryhem Kochti' },
            conversation_id: 1,
            created_at: '2024-03-25T11:00:00Z',
            updated_at: '2024-03-25T11:00:00Z'
          }
        ];
      } else {
        this.messages = [];
      }

      this.loading = false;
      this.shouldScrollToBottom = true;
    }, 300);
  }

  sendMessage(): void {
    if (!this.currentConversation || this.messageForm.invalid || this.sendingMessage) {
      return;
    }

    const content = this.messageForm.get('content')?.value?.trim();
    if (!content && !this.selectedFile) {
      return;
    }

    this.sendingMessage = true;
    this.errorMessage = null;
    
    // Disable input while sending
    this.messageForm.get('content')?.disable();
    
    const messageType = this.selectedFile ? this.getFileType(this.selectedFile) : 'text';

    // Create temporary message with sending status
    const tempMessage: Message = {
      id: Date.now(),
      content: content || '',
      type: messageType as 'text' | 'image' | 'file' | 'audio',
      user: { id: this.currentUserId || 0, name: 'Vous' },
      conversation_id: this.currentConversation.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'sending'
    };

    this.messages.push(tempMessage);
    this.shouldScrollToBottom = true;

    // Save to storage immediately
    this.saveConversationToStorage(this.currentConversation, this.messages);

    // Check if this is a mock conversation
    if (this.currentConversation.id > 1000000000000) {
      // Mock conversation - just update status to sent
      setTimeout(() => {
        tempMessage.status = 'sent';
        this.sendingMessage = false;
        this.messageForm.reset();
        this.messageForm.get('content')?.enable();
        this.selectedFile = null;
        // Update storage with sent message
        this.saveConversationToStorage(this.currentConversation!, this.messages);
      }, 1000);
      return;
    }

    // Send message via API for real conversations
    this.chatApiService.sendMessage(this.currentConversation.id, content, messageType, this.selectedFile || undefined)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error sending message:', error);
          // Update message status to failed
          const failedMessage = this.messages.find(m => m.id === tempMessage.id);
          if (failedMessage) {
            failedMessage.status = 'failed';
            failedMessage.retry_count = (failedMessage.retry_count || 0) + 1;
          }
          this.errorMessage = error.message || 'Erreur lors de l\'envoi du message';
          return of(null);
        })
      )
      .subscribe(response => {
        this.sendingMessage = false;
        this.messageForm.get('content')?.enable();
        
        if (response && response.success) {
          // Replace temporary message with API response
          const messageIndex = this.messages.findIndex(m => m.id === tempMessage.id);
          if (messageIndex !== -1) {
            this.messages[messageIndex] = {
              ...response.data,
              status: 'sent'
            };
          }
        } else {
          // Update message status to failed if no response
          const failedMessage = this.messages.find(m => m.id === tempMessage.id);
          if (failedMessage) {
            failedMessage.status = 'failed';
          }
        }
        
        this.messageForm.reset();
        this.selectedFile = null;
        this.shouldScrollToBottom = true;
        
        // Save updated messages to storage
        this.saveConversationToStorage(this.currentConversation!, this.messages);
      });
  }

  private addLocalMessage(content: string, type: string): void {
    const newMessage: Message = {
      id: Date.now(),
      content: content || '',
      type: type as 'text' | 'image' | 'file' | 'audio',
      user: { id: this.currentUserId || 0, name: 'Vous' },
      conversation_id: this.currentConversation?.id || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.messages.push(newMessage);
    
    // NO MORE AUTOMATIC RESPONSES - Real users will respond manually
  }

  private getFileType(file: File): 'image' | 'audio' | 'file' {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'file';
  }

  private simulateResponse(): void {
    if (!this.currentConversation) return;

    const responses = [
      'Merci pour votre message !',
      'Je vais regarder ça et vous répondre bientôt.',
      'C\'est noté, merci.',
      'Parfait, on se parle bientôt !',
      'D\'accord, je comprends.'
    ];

    const otherUser = this.currentConversation.participants.find(p => p.id !== this.currentUserId);
    if (!otherUser) return;

    const responseMessage: Message = {
      id: Date.now() + 1,
      content: responses[Math.floor(Math.random() * responses.length)],
      type: 'text',
      user: otherUser,
      conversation_id: this.currentConversation.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.messages.push(responseMessage);
    this.shouldScrollToBottom = true;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      try {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Erreur lors du scroll:', err);
      }
    }
  }

  createConversationWithUser(userId: number, userName?: string): void {
    // Check if conversation already exists in storage first
    const existingStorageKey = Array.from(this.conversationStorage.keys()).find(key => {
      const storedData = this.conversationStorage.get(key);
      return storedData?.conversation.participants.some(p => p.id === userId);
    });

    if (existingStorageKey) {
      const storedData = this.conversationStorage.get(existingStorageKey)!;
      this.conversations = [storedData.conversation];
      this.selectConversation(storedData.conversation);
      return;
    }

    // Vérifier si une conversation existe déjà dans la liste actuelle
    const existingConversation = this.conversations.find(conv =>
      conv.participants.some(p => p.id === userId)
    );

    if (existingConversation) {
      // Afficher seulement cette conversation
      this.conversations = [existingConversation];
      this.selectConversation(existingConversation);
      return;
    }

    // Try to create conversation via API first
    this.chatApiService.createConversationWithUser(userId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error creating conversation:', error);
          // Always fallback to local conversation creation for demo purposes
          this.createLocalConversation(userId, userName);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response && response.success) {
          // Use API response
          this.conversations = [response.data];
          this.selectConversation(response.data);
        } else {
          // Fallback to local conversation
          this.createLocalConversation(userId, userName);
        }
      });
  }

  private createLocalConversation(userId: number, userName?: string): void {
    // Créer une nouvelle conversation localement
    const newConversation: Conversation = {
      id: Date.now(),
      type: 'private',
      participants: [
        { id: userId, name: userName || 'Nouvel utilisateur', is_online: false },
        { id: this.currentUserId || 0, name: 'Vous', is_online: true }
      ],
      latest_message: {
        content: 'Nouvelle conversation',
        created_at: new Date().toISOString(),
        user_name: 'Système'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Afficher seulement cette conversation
    this.conversations = [newConversation];
    this.selectConversation(newConversation);

    // NO AUTOMATIC WELCOME MESSAGE - Users start the conversation manually
    this.messages = []; // Start with empty conversation
    this.shouldScrollToBottom = true;
  }

  toggleConversationList(): void {
    this.showConversationList = !this.showConversationList;
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  }

  isOwnMessage(message: Message): boolean {
    return message.user.id === this.currentUserId;
  }

  getConversationName(conversation: Conversation): string {
    if (conversation.name) {
      return conversation.name;
    }

    const otherUser = conversation.participants.find(p => p.id !== this.currentUserId);
    return otherUser?.name || 'Conversation';
  }

  getConversationAvatar(conversation: Conversation): string {
    const otherUser = conversation.participants.find(p => p.id !== this.currentUserId);
    if (otherUser?.profile_image) {
      return otherUser.profile_image;
    }

    // Générer des initiales
    const name = this.getConversationName(conversation);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getUserInitials(user: User): string {
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  // Save conversation and messages to storage
  private saveConversationToStorage(conversation: Conversation, messages: Message[]): void {
    const conversationKey = `conv_${conversation.id}`;
    this.conversationStorage.set(conversationKey, {
      conversation: conversation,
      messages: [...messages] // Create a copy
    });
  }

  // Retry failed message
  retryMessage(message: Message): void {
    if (!this.currentConversation || message.status !== 'failed') {
      return;
    }

    message.status = 'sending';
    message.retry_count = (message.retry_count || 0) + 1;
    this.errorMessage = null;

    const messageType = message.type;
    
    this.chatApiService.sendMessage(this.currentConversation.id, message.content, messageType)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error retrying message:', error);
          message.status = 'failed';
          this.errorMessage = error.message || 'Erreur lors de la nouvelle tentative';
          return of(null);
        })
      )
      .subscribe(response => {
        if (response && response.success) {
          // Update message with API response
          Object.assign(message, {
            ...response.data,
            status: 'sent'
          });
        } else {
          message.status = 'failed';
        }
      });
  }

  // Delete message
  deleteMessage(message: Message): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }

    this.chatApiService.deleteMessage(message.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error deleting message:', error);
          alert('Erreur lors de la suppression du message');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response && response.success) {
          // Remove message from local array
          const index = this.messages.findIndex(m => m.id === message.id);
          if (index !== -1) {
            this.messages.splice(index, 1);
          }
        }
      });
  }

  // Copy message content
  copyMessage(message: Message): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message.content).then(() => {
        // You could show a toast notification here
        console.log('Message copié dans le presse-papiers');
      }).catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = message.content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Message copié dans le presse-papiers');
    }
  }

  // Refresh messages manually
  refreshMessages(): void {
    if (!this.currentConversation) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // Check if this is a mock conversation
    if (this.currentConversation.id > 1000000000000) {
      // Mock conversation - just reload mock messages
      setTimeout(() => {
        this.loadMockMessages(this.currentConversation!.id);
      }, 500);
      return;
    }

    this.chatApiService.refreshMessages(this.currentConversation.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error refreshing messages:', error);
          this.errorMessage = 'Erreur lors du rafraîchissement des messages';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(response => {
        this.loading = false;
        if (response && response.success) {
          this.messages = response.data.map(msg => ({
            ...msg,
            status: 'sent'
          }));
          this.shouldScrollToBottom = true;
        }
      });
  }

  // Get message status icon
  getMessageStatusIcon(message: Message): string {
    if (!this.isOwnMessage(message)) {
      return '';
    }

    switch (message.status) {
      case 'sending':
        return 'fa-clock text-muted';
      case 'sent':
        return 'fa-check-double text-success';
      case 'failed':
        return 'fa-exclamation-triangle text-danger';
      default:
        return 'fa-check-double text-success';
    }
  }

  // Clear error message
  clearError(): void {
    this.errorMessage = null;
  }

  // File upload with progress
  uploadFileWithProgress(file: File): void {
    this.isUploading = true;
    this.uploadProgress = 0;

    this.chatApiService.uploadFile(file)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error uploading file:', error);
          this.isUploading = false;
          this.uploadProgress = 0;
          alert('Erreur lors du téléchargement du fichier');
          return of(null);
        })
      )
      .subscribe(response => {
        this.isUploading = false;
        this.uploadProgress = 0;
        
        if (response && response.success) {
          // Send message with file
          if (this.currentConversation) {
            const fileType = this.getFileType(file);
            this.chatApiService.sendMessage(
              this.currentConversation.id,
              file.name,
              fileType,
              file
            ).subscribe();
          }
        }
      });
  }
}
