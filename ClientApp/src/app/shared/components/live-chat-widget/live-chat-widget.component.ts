import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  isTyping?: boolean;
}

@Component({
  selector: 'app-live-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-chat-widget.component.html',
  styleUrl: './live-chat-widget.component.css'
})
export class LiveChatWidgetComponent implements OnInit, OnDestroy {
  isOpen = false;
  isMinimized = false;
  newMessage = '';
  isTyping = false;

  messages: ChatMessage[] = [
    {
      id: 1,
      text: 'Hello! How can I help you with your booking today?',
      sender: 'support',
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: 2,
      text: 'I have a question about my upcoming reservation.',
      sender: 'user',
      timestamp: new Date(Date.now() - 240000) // 4 minutes ago
    },
    {
      id: 3,
      text: 'I\'d be happy to help! What would you like to know?',
      sender: 'support',
      timestamp: new Date(Date.now() - 180000) // 3 minutes ago
    }
  ];

  private typingTimeout: any;
  private autoResponseTimeout: any;

  ngOnInit(): void {
    // Auto-show welcome message after 3 seconds
    setTimeout(() => {
      if (!this.isOpen) {
        this.showWelcomeMessage();
      }
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    if (this.autoResponseTimeout) {
      clearTimeout(this.autoResponseTimeout);
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.isMinimized) {
      this.isMinimized = false;
    }
  }

  minimizeChat(): void {
    this.isMinimized = !this.isMinimized;
  }

  closeChat(): void {
    this.isOpen = false;
    this.isMinimized = false;
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: this.newMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.newMessage = '';

    // Simulate typing indicator
    this.isTyping = true;
    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;

      // Auto response after typing
      this.autoResponseTimeout = setTimeout(() => {
        this.sendAutoResponse(userMessage.text);
      }, 1000);
    }, 2000);
  }

  private sendAutoResponse(userMessage: string): void {
    const responses = [
      'Thank you for your message. Let me check that for you.',
      'I understand your concern. Our team will get back to you shortly.',
      'That\'s a great question! Here\'s what I can tell you...',
      'I\'m here to help! Let me look into this for you.',
      'Thanks for reaching out. I\'ll assist you with that right away.',
      'I appreciate you letting me know. Let me help you with this.'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const supportMessage: ChatMessage = {
      id: Date.now(),
      text: randomResponse,
      sender: 'support',
      timestamp: new Date()
    };

    this.messages.push(supportMessage);
  }

  private showWelcomeMessage(): void {
    // This could trigger a notification or highlight the chat button
    console.log('Welcome message could be shown here');
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  getMessageTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  trackByMessageId(index: number, message: ChatMessage): number {
    return message.id;
  }
}
