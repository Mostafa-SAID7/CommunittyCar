import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatMessage, ChatConversation, ChatParticipant, ChatSession, TypingIndicator, ChatSettings } from '../models/chat.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private conversationsSubject = new BehaviorSubject<ChatConversation[]>([]);
  private activeConversationSubject = new BehaviorSubject<ChatConversation | null>(null);
  private typingIndicatorsSubject = new BehaviorSubject<TypingIndicator[]>([]);
  private connectionStatusSubject = new BehaviorSubject<'connecting' | 'connected' | 'disconnected'>('disconnected');
  private settingsSubject = new BehaviorSubject<ChatSettings>(this.getDefaultSettings());

  public conversations$ = this.conversationsSubject.asObservable();
  public activeConversation$ = this.activeConversationSubject.asObservable();
  public typingIndicators$ = this.typingIndicatorsSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();
  public settings$ = this.settingsSubject.asObservable();

  private messageReceivedSubject = new Subject<ChatMessage>();
  public messageReceived$ = this.messageReceivedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadSettings();
  }

  // Connection management
  connect(): void {
    this.connectionStatusSubject.next('connecting');
    // Implement WebSocket connection logic here
    // For now, simulate connection
    setTimeout(() => {
      this.connectionStatusSubject.next('connected');
    }, 1000);
  }

  disconnect(): void {
    this.connectionStatusSubject.next('disconnected');
    // Implement WebSocket disconnection logic
  }

  // Conversation management
  createConversation(participants: string[]): Observable<ChatConversation> {
    const conversation: Partial<ChatConversation> = {
      participants: participants.map(id => ({ id, name: '', role: 'user', isOnline: true })),
      messages: [],
      unreadCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.http.post<ChatConversation>(`${environment.apiUrl}/chat/conversations`, conversation);
  }

  loadConversations(): void {
    this.http.get<ChatConversation[]>(`${environment.apiUrl}/chat/conversations`)
      .subscribe(conversations => {
        this.conversationsSubject.next(conversations);
      });
  }

  setActiveConversation(conversationId: string): void {
    const conversations = this.conversationsSubject.value;
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      this.activeConversationSubject.next(conversation);
      this.markConversationAsRead(conversationId);
    }
  }

  // Message management
  sendMessage(conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): void {
    // For now, get current user synchronously (in real app, you'd subscribe or use a different approach)
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!currentUser) return;

    const message: ChatMessage = {
      id: this.generateId(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: new Date(),
      type,
      status: 'sending'
    };

    // Add message to local conversation
    this.addMessageToConversation(conversationId, message);

    // Send to server
    this.http.post(`${environment.apiUrl}/chat/messages`, {
      conversationId,
      ...message
    }).subscribe({
      next: () => {
        this.updateMessageStatus(conversationId, message.id, 'sent');
      },
      error: () => {
        this.updateMessageStatus(conversationId, message.id, 'failed');
      }
    });
  }

  loadMessages(conversationId: string, page: number = 1, limit: number = 50): void {
    this.http.get<ChatMessage[]>(`${environment.apiUrl}/chat/conversations/${conversationId}/messages`, {
      params: { page: page.toString(), limit: limit.toString() }
    }).subscribe(messages => {
      this.updateConversationMessages(conversationId, messages);
    });
  }

  // Typing indicators
  startTyping(conversationId: string): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!currentUser) return;

    const typingIndicator: TypingIndicator = {
      userId: currentUser.id,
      userName: currentUser.name,
      isTyping: true,
      timestamp: new Date()
    };

    // Send typing indicator to server
    this.http.post(`${environment.apiUrl}/chat/typing`, {
      conversationId,
      ...typingIndicator
    }).subscribe();
  }

  stopTyping(conversationId: string): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!currentUser) return;

    this.http.delete(`${environment.apiUrl}/chat/typing`, {
      body: { conversationId, userId: currentUser.id }
    }).subscribe();
  }

  // Settings management
  updateSettings(settings: Partial<ChatSettings>): void {
    const currentSettings = this.settingsSubject.value;
    const newSettings = { ...currentSettings, ...settings };
    this.settingsSubject.next(newSettings);
    this.saveSettings(newSettings);
  }

  // Utility methods
  private addMessageToConversation(conversationId: string, message: ChatMessage): void {
    const conversations = this.conversationsSubject.value;
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: message,
          updatedAt: new Date()
        };
      }
      return conv;
    });
    this.conversationsSubject.next(updatedConversations);

    // Update active conversation if it's the current one
    const activeConversation = this.activeConversationSubject.value;
    if (activeConversation?.id === conversationId) {
      this.activeConversationSubject.next({
        ...activeConversation,
        messages: [...activeConversation.messages, message],
        lastMessage: message,
        updatedAt: new Date()
      });
    }
  }

  private updateMessageStatus(conversationId: string, messageId: string, status: ChatMessage['status']): void {
    const conversations = this.conversationsSubject.value;
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = conv.messages.map(msg =>
          msg.id === messageId ? { ...msg, status } : msg
        );
        return {
          ...conv,
          messages: updatedMessages,
          lastMessage: updatedMessages[updatedMessages.length - 1]
        };
      }
      return conv;
    });
    this.conversationsSubject.next(updatedConversations);
  }

  private updateConversationMessages(conversationId: string, messages: ChatMessage[]): void {
    const conversations = this.conversationsSubject.value;
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...messages, ...conv.messages]
        };
      }
      return conv;
    });
    this.conversationsSubject.next(updatedConversations);
  }

  private markConversationAsRead(conversationId: string): void {
    const conversations = this.conversationsSubject.value;
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    });
    this.conversationsSubject.next(updatedConversations);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getDefaultSettings(): ChatSettings {
    return {
      soundEnabled: true,
      notificationsEnabled: true,
      autoScroll: true,
      theme: 'light',
      language: 'en'
    };
  }

  private loadSettings(): void {
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        this.settingsSubject.next(settings);
      } catch (error) {
        console.error('Error loading chat settings:', error);
      }
    }
  }

  private saveSettings(settings: ChatSettings): void {
    localStorage.setItem('chatSettings', JSON.stringify(settings));
  }
}