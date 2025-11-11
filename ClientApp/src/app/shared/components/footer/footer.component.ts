import { Component, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icons/icon.component';

/**
 * Interface for basic footer links
 */
interface FooterLink {
  name: string;
  url: string;
}

/**
 * Interface for footer sections
 */
interface FooterSection {
  title: string;
  links: readonly FooterLink[];
}

/**
 * Interface for social media links extending basic footer links
 */
interface SocialLink extends FooterLink {
  icon: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  /** Current year for copyright display */
  readonly currentYear = new Date().getFullYear();

  /** Social media links */
  readonly socialLinks: readonly SocialLink[] = [
    { name: 'Facebook', url: '#', icon: 'facebook' },
    { name: 'Twitter', url: '#', icon: 'twitter' },
    { name: 'Instagram', url: '#', icon: 'instagram' },
    { name: 'LinkedIn', url: '#', icon: 'linkedin' }
  ];

  /** Footer sections for dynamic rendering */
  readonly footerSections: readonly FooterSection[] = [
    {
      title: 'Quick Links',
      links: [
        { name: 'About Us', url: '/about-us' },
        { name: 'Contact', url: '/contact' },
        { name: 'Privacy Policy', url: '/privacy-policy' },
        { name: 'Terms of Service', url: '/terms-of-service' },
        { name: 'FAQ', url: '/faq' }
      ]
    },
    {
      title: 'Cars',
      links: [
        { name: 'Browse Cars', url: '/browse-cars' },
        { name: 'Add Your Car', url: '/add-your-car' },
        { name: 'How It Works', url: '/how-it-works' },
        { name: 'Pricing', url: '/pricing' }
      ]
    }
  ];

  /** TrackBy function for ngFor optimization */
  trackByLink: TrackByFunction<FooterLink> = (index: number, item: FooterLink) => item.url;

  /** TrackBy function for social links */
  trackBySocialLink: TrackByFunction<SocialLink> = (index: number, item: SocialLink) => item.icon;

  /** TrackBy function for sections */
  trackBySection: TrackByFunction<FooterSection> = (index: number, item: FooterSection) => item.title;
}
