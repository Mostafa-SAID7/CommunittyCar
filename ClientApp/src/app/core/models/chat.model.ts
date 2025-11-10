export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  imageUrl?: string;
  replyTo?: string;
}

export interface ChatConversation {
  id: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'support';
  isOnline: boolean;
  lastSeen?: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  agentId?: string;
  status: 'waiting' | 'active' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  startedAt: Date;
  endedAt?: Date;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface ChatSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoScroll: boolean;
  theme: 'light' | 'dark';
  language: string;
}