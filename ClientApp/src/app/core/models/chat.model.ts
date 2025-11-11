export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  messageType: MessageType;
  timestamp: Date;
  isRead: boolean;
  status?: 'sending' | 'sent' | 'failed';
  attachments?: ChatAttachment[];
}

export interface ChatConversation {
  id: string;
  participants: ChatParticipant[];
  messages?: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatParticipant {
  userId: string;
  name: string;
  avatar?: string;
  role: ParticipantRole;
  joinedAt: Date;
  isOnline?: boolean;
}

export interface ChatAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system'
}

export enum ParticipantRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  SUPPORT = 'support'
}

export interface ChatMessageCreateRequest {
  conversationId: string;
  content: string;
  messageType: MessageType;
  attachments?: File[];
}

export interface ChatConversationCreateRequest {
  participantIds: string[];
  title?: string;
}

export interface ChatTypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface ChatSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoScroll: boolean;
  theme: string;
  language: string;
}

export type TypingIndicator = ChatTypingIndicator;