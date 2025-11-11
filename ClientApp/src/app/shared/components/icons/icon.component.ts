import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { resolveIconName } from './icons.config';

// Import Lucide icons
import {
  Home, Menu, Search, Settings, User, Users,
  Plus, Minus, Edit, Trash, Save, Download, Upload,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Check, X, AlertTriangle, Info, CheckCircle, XCircle, AlertCircle,
  Mail, MessageCircle, Phone,
  File, Folder,
  Eye, EyeOff, Calendar, Clock,
  Play, Pause, Volume2, VolumeX,
  Github, Twitter, Facebook,
  Sun, Moon, Cloud,
  Car, Truck,
  ShoppingCart, CreditCard,
  Wrench
} from 'lucide-angular';

// Create icon map using Lucide icons
const ICONS = {
  // Navigation
  'home': Home,
  'menu': Menu,
  'search': Search,
  'settings': Settings,
  'user': User,
  'users': Users,

  // Actions
  'plus': Plus,
  'minus': Minus,
  'edit': Edit,
  'trash': Trash,
  'save': Save,
  'download': Download,
  'upload': Upload,

  // Arrows
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,

  // Status
  'check': Check,
  'x': X,
  'alert-triangle': AlertTriangle,
  'info': Info,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'alert-circle': AlertCircle,

  // Media
  'play': Play,
  'pause': Pause,
  'volume-2': Volume2,
  'volume-x': VolumeX,

  // Communication
  'mail': Mail,
  'message-circle': MessageCircle,
  'phone': Phone,

  // Files
  'file': File,
  'folder': Folder,

  // UI Elements
  'eye': Eye,
  'eye-off': EyeOff,
  'calendar': Calendar,
  'clock': Clock,

  // Social
  'github': Github,
  'twitter': Twitter,
  'facebook': Facebook,

  // Weather
  'sun': Sun,
  'moon': Moon,
  'cloud': Cloud,

  // Transportation
  'car': Car,
  'truck': Truck,

  // Shopping
  'shopping-cart': ShoppingCart,
  'credit-card': CreditCard,

  // Tools
  'wrench': Wrench
};

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      [attr.viewBox]="viewBox"
      [attr.fill]="fill"
      [attr.stroke]="stroke"
      [attr.stroke-width]="strokeWidth"
      [style.transform]="rotation ? 'rotate(' + rotation + 'deg)' : null"
      class="icon"
      [class]="customClass"
      [innerHTML]="iconSvg"
    ></svg>
  `,
  styles: [`
    .icon {
      display: inline-block;
      flex-shrink: 0;
      transition: all 0.2s ease-in-out;
    }

    .icon:hover {
      transform: scale(1.1);
    }
  `]
})
export class IconComponent implements OnInit {
  @Input() name: string = '';
  @Input() size: number = 24;
  @Input() stroke: string = 'currentColor';
  @Input() fill: string = 'none';
  @Input() strokeWidth: number = 2;
  @Input() rotation: number | null = null;
  @Input() customClass: string = '';
  @Input() viewBox: string = '0 0 24 24';

  iconSvg: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.updateIcon();
  }

  ngOnChanges() {
    this.updateIcon();
  }

  private updateIcon() {
    const resolvedName = resolveIconName(this.name);
    const iconData = ICONS[resolvedName as keyof typeof ICONS];

    if (iconData) {
      // Create SVG using Lucide icon data
      try {
        const svgContent = `
          <svg width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="${this.fill}" stroke="${this.stroke}" stroke-width="${this.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
            <path d="${iconData}"></path>
          </svg>
        `;
        this.iconSvg = this.sanitizer.bypassSecurityTrustHtml(svgContent);
      } catch (error) {
        // Fallback if icon creation fails
        this.iconSvg = this.sanitizer.bypassSecurityTrustHtml('<circle cx="12" cy="12" r="10"></circle>');
      }
    } else {
      // Fallback to a default icon
      this.iconSvg = this.sanitizer.bypassSecurityTrustHtml('<circle cx="12" cy="12" r="10"></circle>');
    }
  }
}