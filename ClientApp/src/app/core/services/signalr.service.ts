import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Notification } from '../models/notification.model';
import { ChatMessage } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection | null = null;
  private connectionState$ = new BehaviorSubject<boolean>(false);
  private notificationReceived$ = new Subject<Notification>();
  private messageReceived$ = new Subject<ChatMessage>();
  private typingIndicatorReceived$ = new Subject<any>();

  constructor(private authService: AuthService) {}

  async startConnection(): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    try {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${environment.apiUrl}/hubs/notifications`, {
          accessTokenFactory: () => this.authService.getToken() || ''
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      await this.hubConnection.start();
      console.log('SignalR connection started');
      this.connectionState$.next(true);

      this.registerConnectionEvents();
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      this.connectionState$.next(false);
      throw error;
    }
  }

  async stopConnection(): Promise<void> {
    if (this.hubConnection && this.hubConnection.state !== HubConnectionState.Disconnected) {
      try {
        await this.hubConnection.stop();
        this.connectionState$.next(false);
        console.log('SignalR connection stopped');
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      }
    }
  }

  getConnectionState(): Observable<boolean> {
    return this.connectionState$.asObservable();
  }

  // Notification methods
  async joinNotificationGroup(userId: string): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.invoke('JoinNotificationGroup', userId);
      } catch (error) {
        console.error('Error joining notification group:', error);
        throw error;
      }
    }
  }

  async leaveNotificationGroup(userId: string): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.invoke('LeaveNotificationGroup', userId);
      } catch (error) {
        console.error('Error leaving notification group:', error);
        throw error;
      }
    }
  }

  onNotificationReceived(): Observable<Notification> {
    return this.notificationReceived$.asObservable();
  }

  // Chat methods
  async joinChatGroup(conversationId: string): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.invoke('JoinChatGroup', conversationId);
      } catch (error) {
        console.error('Error joining chat group:', error);
        throw error;
      }
    }
  }

  async leaveChatGroup(conversationId: string): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.invoke('LeaveChatGroup', conversationId);
      } catch (error) {
        console.error('Error leaving chat group:', error);
        throw error;
      }
    }
  }

  async sendMessage(conversationId: string, message: string, userId: string): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.invoke('SendMessage', conversationId, message, userId);
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    }
  }

  async sendTypingIndicator(conversationId: string, userId: string, isTyping: boolean): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.invoke('SendTypingIndicator', conversationId, userId, isTyping);
      } catch (error) {
        console.error('Error sending typing indicator:', error);
        throw error;
      }
    }
  }

  onMessageReceived(): Observable<ChatMessage> {
    return this.messageReceived$.asObservable();
  }

  onTypingIndicatorReceived(): Observable<any> {
    return this.typingIndicatorReceived$.asObservable();
  }

  private registerConnectionEvents(): void {
    if (!this.hubConnection) return;

    this.hubConnection.onclose(() => {
      console.log('SignalR connection closed');
      this.connectionState$.next(false);
    });

    this.hubConnection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
    });

    this.hubConnection.onreconnected(() => {
      console.log('SignalR reconnected');
      this.connectionState$.next(true);
    });

    // Register event handlers for notifications and messages
    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      this.notificationReceived$.next(notification);
    });

    this.hubConnection.on('ReceiveMessage', (message: ChatMessage) => {
      this.messageReceived$.next(message);
    });

    this.hubConnection.on('ReceiveTypingIndicator', (indicator) => {
      this.typingIndicatorReceived$.next(indicator);
    });
  }
}