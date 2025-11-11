import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NetworkService } from '../../../core/services/network.service';

@Component({
  selector: 'app-network-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="!networkService.isOnline()"
      class="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 text-center text-sm font-medium shadow-lg"
      role="alert"
      aria-live="assertive"
    >
      <div class="flex items-center justify-center space-x-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span>You're currently offline. Some features may be limited.</span>
      </div>
    </div>

    <div
      *ngIf="networkService.isOnline() && showReconnectedMessage"
      class="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white px-4 py-2 text-center text-sm font-medium shadow-lg animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-center justify-center space-x-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <span>Connection restored! You're back online.</span>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class NetworkStatusComponent implements OnInit, OnDestroy {
  showReconnectedMessage = false;
  private wasOffline = false;
  private subscription?: Subscription;

  constructor(public networkService: NetworkService) {}

  ngOnInit() {
    // Show reconnection message when coming back online
    this.subscription = this.networkService.onlineStatus$.subscribe(isOnline => {
      if (isOnline && this.wasOffline) {
        this.showReconnectedMessage = true;
        // Hide the message after 3 seconds
        setTimeout(() => {
          this.showReconnectedMessage = false;
        }, 3000);
      }
      this.wasOffline = !isOnline;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}