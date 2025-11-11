import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.css'
})
export class ScrollToTopComponent implements OnInit, OnDestroy {
  isVisible = false;
  scrollThreshold = 300;
  private scrollListener?: () => void;

  ngOnInit(): void {
    // Check initial scroll position
    this.checkScrollPosition();

    // Add scroll listener
    this.scrollListener = () => this.checkScrollPosition();
    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isVisible = scrollTop > this.scrollThreshold;
  }

  scrollToTop(): void {
    this.smoothScrollToTop();
  }

  private smoothScrollToTop(): void {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (currentScroll > 0) {
      window.requestAnimationFrame(() => this.smoothScrollToTop());
      window.scrollTo(0, currentScroll - currentScroll / 8);
    }
  }

  // Alternative smooth scroll using native scroll behavior
  private smoothScrollToTopNative(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
