import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../core/services/chat.service';
import { ChatMessage, ChatConversation, TypingIndicator } from '../../../core/models/chat.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-live-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, DateFormatPipe],
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void => *', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-in')
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ]),
    trigger('messageAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class LiveChatComponent implements OnInit, OnDestroy {
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen: boolean = false;
  isMinimized: boolean = false;
  isConnected: boolean = false;
  currentMessage: string = '';
  activeConversation: ChatConversation | null = null;
  typingIndicators: TypingIndicator[] = [];
  isTyping: boolean = false;
  unreadCount: number = 0;

  private subscriptions: Subscription = new Subscription();
  private typingTimeout: any;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.chatService.connectionStatus$.subscribe(status => {
        this.isConnected = status === 'connected';
      })
    );

    this.subscriptions.add(
      this.chatService.activeConversation$.subscribe(conversation => {
        this.activeConversation = conversation;
        if (conversation && this.isOpen) {
          this.scrollToBottom();
        }
      })
    );

    this.subscriptions.add(
      this.chatService.typingIndicators$.subscribe(indicators => {
        this.typingIndicators = indicators;
      })
    );

    this.subscriptions.add(
      this.chatService.messageReceived$.subscribe(message => {
        if (this.activeConversation && message.senderId !== this.getCurrentUserId()) {
          this.unreadCount++;
          if (!this.isOpen) {
            // Show notification for new message
            this.showNotification();
          }
        }
        this.scrollToBottom();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isMinimized = false;
      this.unreadCount = 0;
      this.scrollToBottom();
      this.connectToChat();
    } else {
      this.stopTyping();
    }
  }

  minimizeChat(): void {
    this.isMinimized = !this.isMinimized;
  }

  closeChat(): void {
    this.isOpen = false;
    this.isMinimized = false;
    this.stopTyping();
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || !this.activeConversation) return;

    const message = this.currentMessage.trim();
    this.currentMessage = '';
    this.stopTyping();

    this.chatService.sendMessage(this.activeConversation.id, message);
    this.scrollToBottom();
  }

  onMessageInput(): void {
    if (!this.activeConversation) return;

    if (!this.isTyping) {
      this.isTyping = true;
      this.chatService.startTyping(this.activeConversation.id);
    }

    // Reset typing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = setTimeout(() => {
      this.stopTyping();
    }, 1000);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private stopTyping(): void {
    if (this.isTyping && this.activeConversation) {
      this.isTyping = false;
      this.chatService.stopTyping(this.activeConversation.id);
    }
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  private connectToChat(): void {
    if (!this.activeConversation) {
      // Create or load default conversation
      this.chatService.loadConversations();
      // For demo, create a conversation with support
      this.chatService.createConversation(['support']).subscribe(conversation => {
        this.chatService.setActiveConversation(conversation.id);
      });
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  private getCurrentUserId(): string {
    // Get current user ID from auth service or local storage
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.id || '';
  }

  private showNotification(): void {
    // Use notification service to show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Message', {
        body: 'You have a new message in chat',
        icon: '/favicon.ico'
      });
    }
  }

  getTypingUsers(): string[] {
    return this.typingIndicators
      .filter(indicator => indicator.isTyping && indicator.userId !== this.getCurrentUserId())
      .map(indicator => indicator.userName);
  }

  isMessageFromCurrentUser(message: ChatMessage): boolean {
    return message.senderId === this.getCurrentUserId();
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }
}