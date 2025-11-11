import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ChatMessage,
  ChatConversation,
  ChatMessageCreateRequest,
  ChatConversationCreateRequest,
  ChatTypingIndicator,
  ChatParticipant,
  ParticipantRole
} from '../models/chat.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/api/chat`;
  private conversations$ = new BehaviorSubject<ChatConversation[]>([]);
  private activeConversation$ = new BehaviorSubject<ChatConversation | null>(null);
  private typingIndicators$ = new BehaviorSubject<ChatTypingIndicator[]>([]);

  constructor(private http: HttpClient) {}

  // Conversations
  getConversations(): Observable<ApiResponse<ChatConversation[]>> {
    return this.http.get<ApiResponse<ChatConversation[]>>(`${this.apiUrl}/conversations`).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.conversations$.next(response.data);
        }
      })
    );
  }

  getConversation(id: string): Observable<ApiResponse<ChatConversation>> {
    return this.http.get<ApiResponse<ChatConversation>>(`${this.apiUrl}/conversations/${id}`).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.activeConversation$.next(response.data);
        }
      })
    );
  }

  createConversation(request: ChatConversationCreateRequest): Observable<ApiResponse<ChatConversation>> {
    return this.http.post<ApiResponse<ChatConversation>>(`${this.apiUrl}/conversations`, request).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.addConversationToList(response.data);
        }
      })
    );
  }

  // Messages
  getMessages(conversationId: string, page: number = 1, pageSize: number = 50): Observable<ApiResponse<ChatMessage[]>> {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.http.get<ApiResponse<ChatMessage[]>>(`${this.apiUrl}/conversations/${conversationId}/messages`, { params });
  }

  sendMessage(request: ChatMessageCreateRequest): Observable<ApiResponse<ChatMessage>> {
    const formData = new FormData();
    formData.append('conversationId', request.conversationId);
    formData.append('content', request.content);
    formData.append('messageType', request.messageType);

    if (request.attachments) {
      request.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    return this.http.post<ApiResponse<ChatMessage>>(`${this.apiUrl}/messages`, formData);
  }

  markMessageAsRead(messageId: string): Observable<any> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/messages/${messageId}/read`, {});
  }

  // Local state management
  getConversationsObservable(): Observable<ChatConversation[]> {
    return this.conversations$.asObservable();
  }

  getActiveConversationObservable(): Observable<ChatConversation | null> {
    return this.activeConversation$.asObservable();
  }

  getTypingIndicatorsObservable(): Observable<ChatTypingIndicator[]> {
    return this.typingIndicators$.asObservable();
  }

  setActiveConversation(conversation: ChatConversation | null): void {
    this.activeConversation$.next(conversation);
  }

  // Real-time updates from SignalR
  addRealTimeMessage(message: ChatMessage): void {
    const activeConversation = this.activeConversation$.value;
    if (activeConversation && activeConversation.id === message.conversationId) {
      // Update active conversation's last message
      activeConversation.lastMessage = message;
      activeConversation.updatedAt = message.timestamp;
      this.activeConversation$.next({ ...activeConversation });
    }

    // Update conversations list
    const conversations = this.conversations$.value;
    const conversationIndex = conversations.findIndex(c => c.id === message.conversationId);
    if (conversationIndex !== -1) {
      conversations[conversationIndex].lastMessage = message;
      conversations[conversationIndex].updatedAt = message.timestamp;
      conversations[conversationIndex].unreadCount += 1; // Increment unread count
      this.conversations$.next([...conversations]);
    }
  }

  updateTypingIndicator(indicator: ChatTypingIndicator): void {
    const currentIndicators = this.typingIndicators$.value;
    const existingIndex = currentIndicators.findIndex(
      i => i.conversationId === indicator.conversationId && i.userId === indicator.userId
    );

    if (indicator.isTyping) {
      if (existingIndex === -1) {
        this.typingIndicators$.next([...currentIndicators, indicator]);
      }
    } else {
      if (existingIndex !== -1) {
        const updatedIndicators = currentIndicators.filter((_, index) => index !== existingIndex);
        this.typingIndicators$.next(updatedIndicators);
      }
    }
  }

  private addConversationToList(conversation: ChatConversation): void {
    const currentConversations = this.conversations$.value;
    this.conversations$.next([conversation, ...currentConversations]);
  }

  // Utility methods
  getUnreadMessagesCount(): number {
    return this.conversations$.value.reduce((total, conversation) => total + conversation.unreadCount, 0);
  }

  markConversationAsRead(conversationId: string): void {
    const conversations = this.conversations$.value;
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      this.conversations$.next([...conversations]);
    }
  }
}