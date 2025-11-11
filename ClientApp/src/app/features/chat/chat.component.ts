import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { ChatMessage, ChatConversation, ChatTypingIndicator, MessageType } from '../../core/models/chat.model';
import { ChatStore } from '../../core/state/chat.store';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, DateFormatPipe],
  template: `
    <div class="chat-page">
      <div class="chat-container">
        <!-- Conversations Sidebar -->
        <div class="conversations-sidebar">
          <div class="sidebar-header">
            <h2>Messages</h2>
            <button class="new-chat-btn" (click)="startNewConversation()">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>

          <div class="conversations-list">
            <div
              *ngFor="let conversation of conversations"
              class="conversation-item"
              [ngClass]="{ 'active': conversation.id === (activeConversation$ | async)?.id }"
              (click)="selectConversation(conversation)">
              <div class="conversation-avatar">
                <span>{{ getConversationInitials(conversation) }}</span>
              </div>
              <div class="conversation-info">
                <div class="conversation-name">{{ getConversationName(conversation) }}</div>
                <div class="conversation-last-message">
                  {{ conversation.lastMessage?.content || 'No messages yet' }}
                </div>
              </div>
              <div class="conversation-meta">
                <span class="conversation-time">
                  {{ conversation.lastMessage?.timestamp | dateFormat:'short' }}
                </span>
                <span *ngIf="conversation.unreadCount > 0" class="unread-badge">
                  {{ conversation.unreadCount }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="chat-area" *ngIf="activeConversation$ | async as conversation; else noConversation">
          <div class="chat-header">
            <div class="chat-partner-info">
              <div class="partner-avatar">
                <span>{{ getConversationInitials(conversation) }}</span>
              </div>
              <div class="partner-details">
                <h3>{{ getConversationName(conversation) }}</h3>
                <span class="partner-status">Active</span>
              </div>
            </div>
          </div>

          <div class="messages-container" #messagesContainer>
            <div
              *ngFor="let message of messages"
              class="message-item"
              [ngClass]="{ 'own': message.senderId === currentUserId }">
              <div class="message-avatar" *ngIf="message.senderId !== currentUserId">
                <span>{{ message.senderName.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="message-content">
                <div class="message-bubble">
                  <p>{{ message.content }}</p>
                  <span class="message-time">{{ message.timestamp | dateFormat:'time' }}</span>
                </div>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div *ngIf="typingIndicators.length > 0" class="typing-indicator">
              <div class="typing-avatar">
                <span>{{ typingIndicators[0].userName.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="typing-bubble">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div class="message-input-area">
            <form (ngSubmit)="sendMessage()" #messageForm="ngForm">
              <div class="input-container">
                <input
                  type="text"
                  [(ngModel)]="newMessage"
                  name="message"
                  placeholder="Type a message..."
                  (input)="onTyping()"
                  (blur)="onStopTyping()"
                  required
                  #messageInput>
                <button
                  type="submit"
                  [disabled]="!newMessage.trim() || loading"
                  class="send-btn">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        <ng-template #noConversation>
          <div class="no-conversation">
            <div class="empty-state">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start chatting</p>
            </div>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .chat-page {
      height: calc(100vh - 4rem);
      background: #f8fafc;
    }

    .chat-container {
      display: flex;
      height: 100%;
      background: white;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .conversations-sidebar {
      width: 320px;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    .new-chat-btn {
      width: 2rem;
      height: 2rem;
      border: none;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .new-chat-btn:hover {
      background: #2563eb;
    }

    .conversations-list {
      flex: 1;
      overflow-y: auto;
    }

    .conversation-item {
      padding: 1rem;
      cursor: pointer;
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.2s;
    }

    .conversation-item:hover {
      background: #f8fafc;
    }

    .conversation-item.active {
      background: #eff6ff;
      border-right: 3px solid #3b82f6;
    }

    .conversation-item {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .conversation-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
    }

    .conversation-info {
      flex: 1;
      min-width: 0;
    }

    .conversation-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .conversation-last-message {
      font-size: 0.875rem;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .conversation-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .conversation-time {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .unread-badge {
      background: #ef4444;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 0.75rem;
      min-width: 1.25rem;
      text-align: center;
    }

    .chat-area {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
      background: white;
    }

    .chat-partner-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .partner-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
    }

    .partner-details h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .partner-status {
      font-size: 0.875rem;
      color: #10b981;
    }

    .messages-container {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message-item {
      display: flex;
      gap: 0.75rem;
      align-items: flex-end;
    }

    .message-item.own {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
      color: #64748b;
    }

    .message-content {
      max-width: 70%;
    }

    .message-bubble {
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      position: relative;
    }

    .message-item:not(.own) .message-bubble {
      background: #f1f5f9;
      color: #1e293b;
    }

    .message-item.own .message-bubble {
      background: #3b82f6;
      color: white;
    }

    .message-bubble p {
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .message-time {
      font-size: 0.75rem;
      opacity: 0.7;
      margin-top: 0.25rem;
      display: block;
    }

    .typing-indicator {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .typing-avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
      color: #64748b;
    }

    .typing-bubble {
      padding: 0.75rem 1rem;
      background: #f1f5f9;
      border-radius: 1rem;
    }

    .typing-dots {
      display: flex;
      gap: 0.25rem;
    }

    .typing-dots span {
      width: 0.375rem;
      height: 0.375rem;
      background: #94a3b8;
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }

    .typing-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-10px);
      }
    }

    .message-input-area {
      padding: 1rem;
      border-top: 1px solid #e2e8f0;
      background: white;
    }

    .input-container {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .input-container input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 2rem;
      outline: none;
      font-size: 0.875rem;
    }

    .input-container input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .send-btn {
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .send-btn:hover:not(:disabled) {
      background: #2563eb;
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .no-conversation {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-state {
      text-align: center;
      color: #64748b;
    }

    .empty-state svg {
      width: 4rem;
      height: 4rem;
      margin: 0 auto 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    .empty-state p {
      margin: 0;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .conversations-sidebar {
        width: 280px;
      }

      .message-content {
        max-width: 85%;
      }
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  private destroy$ = new Subject<void>();
  private typingTimeout: any;

  conversations: ChatConversation[] = [];
  activeConversation$: any;
  messages: ChatMessage[] = [];
  typingIndicators: ChatTypingIndicator[] = [];
  newMessage = '';
  currentUserId = 'current-user'; // This should come from auth service
  loading = false;

  constructor(private chatStore: ChatStore, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.activeConversation$ = this.chatStore.activeConversation$;

    // Subscribe to store state
    this.chatStore.conversations$
      .pipe(takeUntil(this.destroy$))
      .subscribe((conversations: any) => {
        this.conversations = conversations;
      });

    combineLatest([
      this.chatStore.messages$,
      this.chatStore.activeConversation$
    ]).pipe(takeUntil(this.destroy$))
    .subscribe((result: any) => {
      const [messages, activeConversation] = result;
      if (activeConversation) {
        this.messages = messages[activeConversation.id] || [];
        this.scrollToBottom();
      }
    });

    this.chatStore.typingIndicators$
      .pipe(takeUntil(this.destroy$))
      .subscribe((indicators: any) => {
        this.typingIndicators = indicators;
      });

    this.chatStore.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: any) => {
        this.loading = loading;
      });

    // Load conversations
    (this.chatStore as any).loadConversations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectConversation(conversation: ChatConversation): void {
    (this.chatStore as any).setActiveConversation(conversation);
    (this.chatStore as any).loadMessages({ conversationId: conversation.id });
    (this.chatStore as any).markConversationAsRead(conversation.id);
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const activeConversation = (this.chatStore as any).get().activeConversation;
    if (!activeConversation) return;

    // Create message object
    const message: ChatMessage = {
      id: Date.now().toString(), // Temporary ID
      conversationId: activeConversation.id,
      senderId: this.currentUserId,
      senderName: 'You', // Should come from auth service
      content: this.newMessage.trim(),
      messageType: MessageType.TEXT,
      timestamp: new Date(),
      isRead: false
    };

    // Optimistically add message
    this.chatStore.sendMessage(message);

    // Clear input
    this.newMessage = '';
    this.messageInput.nativeElement.focus();
    this.onStopTyping();
  }

  onTyping(): void {
    const activeConversation = (this.chatStore as any).get().activeConversation;
    if (!activeConversation) return;

    // Send typing indicator
    // This would integrate with SignalR service

    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Set new timeout to stop typing
    this.typingTimeout = setTimeout(() => {
      this.onStopTyping();
    }, 1000);
  }

  onStopTyping(): void {
    // Stop typing indicator
    // This would integrate with SignalR service
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  startNewConversation(): void {
    // Open modal or navigate to contact selection
    console.log('Start new conversation');
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    });
  }

  getConversationInitials(conversation: ChatConversation): string {
    const name = this.getConversationName(conversation);
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
  }

  getConversationName(conversation: ChatConversation): string {
    // For now, just return participant names
    // In a real app, you'd have conversation names
    return conversation.participants.map(p => p.name).join(', ');
  }
}