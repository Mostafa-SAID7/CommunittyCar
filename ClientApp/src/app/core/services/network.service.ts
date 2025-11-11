import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, merge, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private onlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  private connectionStatusSubject = new BehaviorSubject<'online' | 'offline'>(navigator.onLine ? 'online' : 'offline');

  // Signal for reactive components
  private _isOnline = signal(navigator.onLine);
  public isOnline = this._isOnline.asReadonly();

  // Computed signal for connection status
  public connectionStatus = computed(() => this._isOnline() ? 'online' : 'offline');

  constructor() {
    // Listen for online/offline events
    const online$ = fromEvent(window, 'online').pipe(map(() => true));
    const offline$ = fromEvent(window, 'offline').pipe(map(() => false));

    merge(online$, offline$)
      .pipe(startWith(navigator.onLine))
      .subscribe(isOnline => {
        this.onlineSubject.next(isOnline);
        this.connectionStatusSubject.next(isOnline ? 'online' : 'offline');
        this._isOnline.set(isOnline);
      });
  }

  /**
   * Observable for online/offline status
   */
  get onlineStatus$(): Observable<boolean> {
    return this.onlineSubject.asObservable();
  }

  /**
   * Observable for connection status ('online' | 'offline')
   */
  get connectionStatus$(): Observable<'online' | 'offline'> {
    return this.connectionStatusSubject.asObservable();
  }

  /**
   * Current online status
   */
  get isCurrentlyOnline(): boolean {
    return this._isOnline();
  }

  /**
   * Check if the device has a stable internet connection
   * This performs a simple fetch to test connectivity
   */
  async checkConnection(): Promise<boolean> {
    try {
      // Try to fetch a small resource from a reliable source
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get connection type information (if available)
   */
  getConnectionInfo(): {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  } {
    const connection = (navigator as any).connection ||
                      (navigator as any).mozConnection ||
                      (navigator as any).webkitConnection;

    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      };
    }

    return {};
  }
}