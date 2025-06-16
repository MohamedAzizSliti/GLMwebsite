export interface User {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
  isTyping?: boolean;
}

export interface RealTimeMessage {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  conversationId: string;
  isEdited?: boolean;
  editedAt?: Date;
  replyTo?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  deliveryStatus?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  name?: string;
  type: 'private' | 'group';
  participants: User[];
  lastMessage?: RealTimeMessage;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TypingEvent {
  userId: number;
  userName: string;
  conversationId: string;
  isTyping: boolean;
}

export interface UserPresence {
  userId: number;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface MessageDeliveryStatus {
  messageId: string;
  userId: number;
  status: 'delivered' | 'read';
  timestamp: Date;
} 