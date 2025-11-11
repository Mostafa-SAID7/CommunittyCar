import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';
import { NotificationService } from '../../core/services/notification.service';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  isAdmin: boolean;
}

interface ChatConversation {
  id: string;
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: 'active' | 'closed';
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="chat-container">
      <div class="chat-sidebar">
        <div class="sidebar-header">
          <h2>Live Chat Support</h2>
          <span class="online-status">● Online</span>
        </div>

        <div class="conversations-list">
          <div class="conversation-item"
               *ngFor="let conversation of conversations"
               [class.active]="conversation.id === activeConversationId"
               (click)="selectConversation(conversation)">
            <div class="user-avatar">
              {{ conversation.userName.charAt(0).toUpperCase() }}
            </div>
            <div class="conversation-info">
              <div class="user-name">{{ conversation.userName }}</div>
              <div class="last-message">{{ conversation.lastMessage }}</div>
            </div>
            <div class="conversation-meta">
              <span class="timestamp">{{ conversation.lastMessageTime | date:'shortTime' }}</span>
              <span class="unread-count" *ngIf="conversation.unreadCount > 0">
                {{ conversation.unreadCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-main">
        <div class="chat-header" *ngIf="activeConversation">
          <div class="chat-user-info">
            <div class="user-avatar">
              {{ activeConversation.userName.charAt(0).toUpperCase() }}
            </div>
            <div class="user-details">
              <h3>{{ activeConversation.userName }}</h3>
              <span class="user-status">Online</span>
            </div>
          </div>
          <div class="chat-actions">
            <button class="btn-secondary" (click)="closeConversation()">Close Chat</button>
          </div>
        </div>

        <div class="chat-messages" #messagesContainer>
          <div class="message"
               *ngFor="let message of messages"
               [class.admin-message]="message.isAdmin"
               [class.user-message]="!message.isAdmin">
            <div class="message-avatar">
              {{ message.senderName.charAt(0).toUpperCase() }}
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.message }}</div>
              <div class="message-time">{{ message.timestamp | date:'shortTime' }}</div>
            </div>
          </div>
        </div>

        <div class="chat-input" *ngIf="activeConversation">
          <form [formGroup]="messageForm" (ngSubmit)="sendMessage()" class="message-form">
            <input type="text"
                   formControlName="message"
                   placeholder="Type your message..."
                   class="message-input"
                   autocomplete="off">
            <button type="submit"
                    class="send-button"
                    [disabled]="!messageForm.valid || isTyping">
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
          <div class="typing-indicator" *ngIf="isTyping">
            <span>Admin is typing...</span>
          </div>
        </div>

        <div class="chat-placeholder" *ngIf="!activeConversation">
          <div class="placeholder-content">
            <i class="fas fa-comments"></i>
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the sidebar to start chatting</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      height: calc(100vh - 4rem);
      background: #f9fafb;
    }

    .chat-sidebar {
      width: 320px;
      background: white;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .online-status {
      color: #10b981;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .conversations-list {
      flex: 1;
      overflow-y: auto;
    }

    .conversation-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      cursor: pointer;
      border-bottom: 1px solid #f3f4f6;
      transition: background-color 0.2s;
    }

    .conversation-item:hover,
    .conversation-item.active {
      background: #f3f4f6;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      margin-right: 0.75rem;
    }

    .conversation-info {
      flex: 1;
    }

    .user-name {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .last-message {
      font-size: 0.875rem;
      color: #6b7280;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .conversation-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .timestamp {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .unread-count {
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      background: white;
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chat-user-info {
      display: flex;
      align-items: center;
    }

    .user-details h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .user-status {
      color: #10b981;
      font-size: 0.875rem;
    }

    .chat-actions .btn-secondary {
      background: #6b7280;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message {
      display: flex;
      gap: 0.75rem;
      max-width: 70%;
    }

    .admin-message {
      align-self: flex-start;
    }

    .user-message {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #6b7280;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 500;
      flex-shrink: 0;
    }

    .admin-message .message-avatar {
      background: #3b82f6;
    }

    .message-content {
      background: white;
      padding: 0.75rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .user-message .message-content {
      background: #3b82f6;
      color: white;
    }

    .message-text {
      margin-bottom: 0.25rem;
    }

    .message-time {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .user-message .message-time {
      color: rgba(255, 255, 255, 0.7);
    }

    .chat-input {
      background: white;
      padding: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .message-form {
      display: flex;
      gap: 0.5rem;
    }

    .message-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    .message-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .send-button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .send-button:hover:not(:disabled) {
      background: #2563eb;
    }

    .send-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .typing-indicator {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
      font-style: italic;
    }

    .chat-placeholder {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .placeholder-content {
      text-align: center;
      color: #6b7280;
    }

    .placeholder-content i {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .placeholder-content h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
    }

    .placeholder-content p {
      margin: 0;
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy {
  conversations: ChatConversation[] = [];
  activeConversation: ChatConversation | null = null;
  activeConversationId: string | null = null;
  messages: ChatMessage[] = [];
  messageForm: FormGroup;
  isTyping = false;

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private notificationService: NotificationService
  ) {
    this.messageForm = this.fb.group({
      message: ['']
    });
  }

  ngOnInit(): void {
    this.loadConversations();
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
  }

  loadConversations(): void {
    // Mock data - replace with actual API call
    this.conversations = [
      {
        id: '1',
        userId: 'user-123',
        userName: 'John Doe',
        lastMessage: 'Hi, I need help with my booking',
        lastMessageTime: new Date(),
        unreadCount: 2,
        status: 'active'
      },
      {
        id: '2',
        userId: 'user-456',
        userName: 'Jane Smith',
        lastMessage: 'Thanks for the assistance!',
        lastMessageTime: new Date(Date.now() - 3600000),
        unreadCount: 0,
        status: 'active'
      }
    ];
  }

  selectConversation(conversation: ChatConversation): void {
    this.activeConversation = conversation;
    this.activeConversationId = conversation.id;
    this.loadMessages(conversation.id);
    conversation.unreadCount = 0;
  }

  loadMessages(conversationId: string): void {
    // Mock messages - replace with actual API call
    this.messages = [
      {
        id: '1',
        senderId: 'user-123',
        senderName: 'John Doe',
        message: 'Hi, I need help with my booking',
        timestamp: new Date(Date.now() - 300000),
        isAdmin: false
      },
      {
        id: '2',
        senderId: 'admin',
        senderName: 'Support',
        message: 'Hello! I\'d be happy to help you with your booking. What seems to be the issue?',
        timestamp: new Date(Date.now() - 240000),
        isAdmin: true
      },
      {
        id: '3',
        senderId: 'user-123',
        senderName: 'John Doe',
        message: 'I\'m having trouble finding available cars for next week',
        timestamp: new Date(Date.now() - 180000),
        isAdmin: false
      }
    ];
  }

  sendMessage(): void {
    if (this.messageForm.valid && this.activeConversation) {
      const messageText = this.messageForm.value.message.trim();
      if (messageText) {
        const message: ChatMessage = {
          id: Date.now().toString(),
          senderId: 'admin',
          senderName: 'Support',
          message: messageText,
          timestamp: new Date(),
          isAdmin: true
        };

        this.messages.push(message);
        this.messageForm.reset();

        // Update conversation
        if (this.activeConversation) {
          this.activeConversation.lastMessage = messageText;
          this.activeConversation.lastMessageTime = new Date();
        }

        // Simulate typing indicator
        this.isTyping = true;
        setTimeout(() => {
          this.isTyping = false;
        }, 2000);
      }
    }
  }

  closeConversation(): void {
    if (this.activeConversation) {
      this.activeConversation.status = 'closed';
      this.activeConversation = null;
      this.activeConversationId = null;
      this.messages = [];
      this.notificationService.showSuccess('Conversation closed');
    }
  }
}