 import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwa-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="showPrompt"
      class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-slide-up"
      role="dialog"
      aria-labelledby="install-title"
      aria-describedby="install-description"
    >
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h3 id="install-title" class="text-lg font-semibold text-gray-900 mb-1">
            Install Community Car
          </h3>
          <p id="install-description" class="text-sm text-gray-600 mb-3">
            Install our app for a better experience. Access car listings, manage bookings, and more - even offline!
          </p>
          <div class="flex space-x-2">
            <button
              (click)="installApp()"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Install
            </button>
            <button
              (click)="dismissPrompt()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          (click)="dismissPrompt()"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-full p-1"
          aria-label="Close"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .animate-slide-up {
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class PwaInstallPromptComponent implements OnInit, OnDestroy {
  showPrompt = false;
  private deferredPrompt: any;
  private dismissed = false;

  ngOnInit() {
    // Check if already installed
    if (this.isAppInstalled()) {
      return;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;

      // Show the prompt after a delay (don't show immediately on page load)
      setTimeout(() => {
        if (!this.dismissed) {
          this.showPrompt = true;
        }
      }, 3000);
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      this.showPrompt = false;
      this.deferredPrompt = null;
    });
  }

  ngOnDestroy() {
    // Clean up event listeners if needed
  }

  installApp() {
    if (!this.deferredPrompt) {
      return;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      this.deferredPrompt = null;
      this.showPrompt = false;
    });
  }

  dismissPrompt() {
    this.showPrompt = false;
    this.dismissed = true;
    // Store dismissal in localStorage to not show again
    localStorage.setItem('pwa-install-dismissed', 'true');
  }

  private isAppInstalled(): boolean {
    // Check if the app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;

    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed') === 'true';

    return isStandalone || isInWebAppiOS || dismissed;
  }
}