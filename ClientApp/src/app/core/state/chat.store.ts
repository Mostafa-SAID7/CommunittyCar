import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, tap } from 'rxjs';
import { ChatMessage, ChatConversation, ChatTypingIndicator } from '../models/chat.model';
import { ChatService } from '../services/chat.service';

export interface ChatState {
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  messages: { [conversationId: string]: ChatMessage[] };
  typingIndicators: ChatTypingIndicator[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: {},
  typingIndicators: [],
  loading: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class ChatStore extends ComponentStore<ChatState> {
  private chatService = inject(ChatService);

  constructor() {
    super(initialState);
  }

  // Selectors
  readonly conversations$ = this.select(state => state.conversations);
  readonly activeConversation$ = this.select(state => state.activeConversation);
  readonly messages$ = this.select(state => state.messages);
  readonly typingIndicators$ = this.select(state => state.typingIndicators);
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);

  readonly getConversationMessages = this.select(
    this.messages$,
    this.activeConversation$,
    (messages, activeConversation) =>
      activeConversation ? messages[activeConversation.id] || [] : []
  );

  readonly getUnreadMessagesCount = this.select(
    this.conversations$,
    conversations => conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  );

  // Effects
  readonly loadConversations = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      this.chatService.getConversations(),
      tap({
        next: (response) => {
          if (response.success && response.data) {
            this.patchState({
              conversations: response.data,
              loading: false
            });
          }
        },
        error: (error) => {
          this.patchState({ error: error.message, loading: false });
        }
      })
    )
  );

  readonly loadConversation = this.effect<string>(conversationId$ =>
    conversationId$.pipe(
      this.chatService.getConversation(conversationId$),
      tap({
        next: (response) => {
          if (response.success && response.data) {
            this.setActiveConversation(response.data);
          }
        },
        error: (error) => {
          this.patchState({ error: error.message });
        }
      })
    )
  );

  readonly loadMessages = this.effect<{ conversationId: string; page?: number; pageSize?: number }>(params$ =>
    params$.pipe(
      tap(params => {
        const { conversationId, page = 1, pageSize = 50 } = params;
        this.chatService.getMessages(conversationId, page, pageSize);
      }),
      tap({
        next: (response) => {
          if (response.success && response.data) {
            this.addMessages(response.data);
          }
        },
        error: (error) => {
          this.patchState({ error: error.message });
        }
      })
    )
  );

  readonly sendMessage = this.effect<ChatMessage>(message$ =>
    message$.pipe(
      tap(message => {
        // Optimistically add message to UI
        this.addMessageToConversation(message);
      }),
      // Here you would call the actual send API
      tap({
        error: (error) => {
          this.patchState({ error: error.message });
          // Revert optimistic update on error
        }
      })
    )
  );

  // Real-time updates
  readonly addRealTimeMessage = this.effect<ChatMessage>(message$ =>
    message$.pipe(
      tap(message => {
        this.addMessageToConversation(message);
        this.updateConversationLastMessage(message);
      })
    )
  );

  readonly updateTypingIndicator = this.effect<ChatTypingIndicator>(indicator$ =>
    indicator$.pipe(
      tap(indicator => {
        this.updateTypingIndicators(indicator);
      })
    )
  );

  // Updaters
  private readonly setActiveConversation = this.updater((state, conversation: ChatConversation) => ({
    ...state,
    activeConversation: conversation
  }));

  private readonly addMessages = this.updater((state, messages: ChatMessage[]) => {
    if (messages.length === 0) return state;

    const conversationId = messages[0].conversationId;
    const existingMessages = state.messages[conversationId] || [];
    const updatedMessages = { ...state.messages };

    // Merge messages, avoiding duplicates
    const messageMap = new Map(existingMessages.map(msg => [msg.id, msg]));
    messages.forEach(msg => messageMap.set(msg.id, msg));

    updatedMessages[conversationId] = Array.from(messageMap.values())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return { ...state, messages: updatedMessages };
  });

  private readonly addMessageToConversation = this.updater((state, message: ChatMessage) => {
    const conversationId = message.conversationId;
    const existingMessages = state.messages[conversationId] || [];
    const updatedMessages = { ...state.messages };

    // Check if message already exists
    if (!existingMessages.find(msg => msg.id === message.id)) {
      updatedMessages[conversationId] = [...existingMessages, message]
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    return { ...state, messages: updatedMessages };
  });

  private readonly updateConversationLastMessage = this.updater((state, message: ChatMessage) => {
    const conversations = state.conversations.map(conv =>
      conv.id === message.conversationId
        ? { ...conv, lastMessage: message, updatedAt: message.timestamp, unreadCount: conv.unreadCount + 1 }
        : conv
    );

    return { ...state, conversations };
  });

  private readonly updateTypingIndicators = this.updater((state, indicator: ChatTypingIndicator) => {
    const existingIndex = state.typingIndicators.findIndex(
      i => i.conversationId === indicator.conversationId && i.userId === indicator.userId
    );

    let typingIndicators: ChatTypingIndicator[];

    if (indicator.isTyping) {
      if (existingIndex === -1) {
        typingIndicators = [...state.typingIndicators, indicator];
      } else {
        typingIndicators = state.typingIndicators;
      }
    } else {
      typingIndicators = state.typingIndicators.filter((_, index) => index !== existingIndex);
    }

    return { ...state, typingIndicators };
  });

  // Methods
  markConversationAsRead(conversationId: string): void {
    this.patchState(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    }));
  }

  clearError(): void {
    this.patchState({ error: null });
  }
}