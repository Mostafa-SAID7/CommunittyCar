import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { name: 'Facebook', url: '#', icon: '📘' },
    { name: 'Twitter', url: '#', icon: '🐦' },
    { name: 'Instagram', url: '#', icon: '📷' },
    { name: 'LinkedIn', url: '#', icon: '💼' }
  ];

  quickLinks = [
    { name: 'About Us', url: '/about' },
    { name: 'Contact', url: '/contact' },
    { name: 'Privacy Policy', url: '/privacy' },
    { name: 'Terms of Service', url: '/terms' },
    { name: 'FAQ', url: '/faq' }
  ];

  carLinks = [
    { name: 'Browse Cars', url: '/cars' },
    { name: 'Add Your Car', url: '/cars/add' },
    { name: 'How It Works', url: '/how-it-works' },
    { name: 'Pricing', url: '/pricing' }
  ];
}