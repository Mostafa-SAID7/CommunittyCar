import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { LiveChatWidgetComponent } from '../../shared/components/live-chat-widget/live-chat-widget.component';
import { ScrollToTopComponent } from '../../shared/components/scroll-to-top/scroll-to-top.component';
import { NetworkStatusComponent } from '../../shared/components/network-status/network-status.component';
import { PwaInstallPromptComponent } from '../../shared/components/pwa-install-prompt/pwa-install-prompt.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, LiveChatWidgetComponent, ScrollToTopComponent, NetworkStatusComponent, PwaInstallPromptComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit {
  showNavbar = false;
  showFooter = false;
  showChatWidget = false;
  showScrollToTop = false;

  // Routes that should show navbar and footer
  private authenticatedRoutes = [
    '/dashboard',
    '/cars',
    '/bookings',
    '/profile',
    '/chat',
    '/admin'
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check initial route
    this.updateLayoutVisibility(this.router.url);

    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateLayoutVisibility(event.url);
      });
  }

  private updateLayoutVisibility(url: string): void {
    // Check if current route is authenticated
    const isAuthenticatedRoute = this.authenticatedRoutes.some(route =>
      url.startsWith(route) || url === route
    );

    // Special case for home page - show minimal layout
    const isHomePage = url === '/' || url === '/home';

    this.showNavbar = isAuthenticatedRoute;
    this.showFooter = isAuthenticatedRoute || isHomePage;
    this.showChatWidget = isAuthenticatedRoute || isHomePage;
    this.showScrollToTop = isAuthenticatedRoute || isHomePage;
  }
}
