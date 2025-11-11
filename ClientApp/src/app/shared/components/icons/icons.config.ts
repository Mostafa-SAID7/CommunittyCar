// Icon configuration for Lucide Angular icons
export const ICON_CONFIG = {
  // Default icon size
  defaultSize: 24,

  // Default stroke width
  defaultStrokeWidth: 2,

  // Icon aliases for easier usage
  aliases: {
    'user-profile': 'user',
    'user-avatar': 'user',
    'user-account': 'user',
    'menu-hamburger': 'menu',
    'menu-burger': 'menu',
    'nav-menu': 'menu',
    'search-icon': 'search',
    'search-magnifier': 'search',
    'magnifier': 'search',
    'home-icon': 'home',
    'house': 'home',
    'dashboard': 'home',
    'settings-gear': 'settings',
    'gear': 'settings',
    'cog': 'settings',
    'config': 'settings',
    'plus-icon': 'plus',
    'add': 'plus',
    'create': 'plus',
    'new': 'plus',
    'minus-icon': 'minus',
    'remove': 'minus',
    'delete': 'trash',
    'bin': 'trash',
    'garbage': 'trash',
    'edit-icon': 'edit',
    'pencil': 'edit',
    'modify': 'edit',
    'save-icon': 'save',
    'floppy': 'save',
    'disk': 'save',
    'download-icon': 'download',
    'dl': 'download',
    'upload-icon': 'upload',
    'ul': 'upload',
    'arrow-left-icon': 'arrow-left',
    'back': 'arrow-left',
    'previous': 'arrow-left',
    'arrow-right-icon': 'arrow-right',
    'forward': 'arrow-right',
    'next': 'arrow-right',
    'arrow-up-icon': 'arrow-up',
    'up': 'arrow-up',
    'arrow-down-icon': 'arrow-down',
    'down': 'arrow-down',
    'check-icon': 'check',
    'tick': 'check',
    'checkmark': 'check',
    'success': 'check-circle',
    'ok': 'check-circle',
    'error': 'x-circle',
    'fail': 'x-circle',
    'warning': 'alert-triangle',
    'warn': 'alert-triangle',
    'caution': 'alert-triangle',
    'info-icon': 'info',
    'information': 'info',
    'help': 'info',
    'mail-icon': 'mail',
    'email': 'mail',
    'envelope': 'mail',
    'message': 'message-circle',
    'chat': 'message-circle',
    'comment': 'message-circle',
    'phone-icon': 'phone',
    'call': 'phone',
    'telephone': 'phone',
    'file-icon': 'file',
    'document': 'file',
    'folder-icon': 'folder',
    'directory': 'folder',
    'calendar-icon': 'calendar',
    'date': 'calendar',
    'schedule': 'calendar',
    'clock-icon': 'clock',
    'time': 'clock',
    'watch': 'clock',
    'eye-icon': 'eye',
    'view': 'eye',
    'show': 'eye',
    'eye-closed': 'eye-off',
    'hide': 'eye-off',
    'invisible': 'eye-off',
    'play-icon': 'play',
    'start': 'play',
    'pause-icon': 'pause',
    'stop': 'pause',
    'volume-up': 'volume-2',
    'volume-down': 'volume-x',
    'mute': 'volume-x',
    'github-icon': 'github',
    'git': 'github',
    'twitter-icon': 'twitter',
    'tweet': 'twitter',
    'facebook-icon': 'facebook',
    'fb': 'facebook',
    'sun-icon': 'sun',
    'light': 'sun',
    'moon-icon': 'moon',
    'dark': 'moon',
    'cloud-icon': 'cloud',
    'weather': 'cloud',
    'car-icon': 'car',
    'vehicle': 'car',
    'auto': 'car',
    'truck-icon': 'truck',
    'lorry': 'truck',
    'cart': 'shopping-cart',
    'basket': 'shopping-cart',
    'buy': 'shopping-cart',
    'credit-card-icon': 'credit-card',
    'payment': 'credit-card',
    'card': 'credit-card',
    'money': 'credit-card',
    'tool-icon': 'tool',
    'wrench-icon': 'wrench',
    'fix': 'wrench',
    'repair': 'wrench'
  },

  // Icon categories for organization
  categories: {
    navigation: [
      'home', 'menu', 'search', 'settings', 'user', 'users',
      'chevron-down', 'chevron-up', 'chevron-left', 'chevron-right',
      'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down'
    ],
    actions: [
      'plus', 'minus', 'edit', 'trash', 'save', 'download', 'upload'
    ],
    status: [
      'check', 'x', 'alert-triangle', 'info', 'check-circle', 'x-circle', 'alert-circle'
    ],
    communication: [
      'mail', 'message-circle', 'phone'
    ],
    files: [
      'file', 'folder'
    ],
    media: [
      'play', 'pause', 'volume-2', 'volume-x'
    ],
    social: [
      'github', 'twitter', 'facebook'
    ],
    weather: [
      'sun', 'moon', 'cloud'
    ],
    transportation: [
      'car', 'truck'
    ],
    shopping: [
      'shopping-cart', 'credit-card'
    ],
    tools: [
      'wrench', 'tool'
    ],
    ui: [
      'eye', 'eye-off', 'calendar', 'clock'
    ]
  },

  // Custom icon sets that can be loaded dynamically
  customSets: {
    // Example: 'custom': '/assets/icons/custom/'
  },

  // Icon variants (filled, outline, etc.)
  variants: {
    filled: ['check-circle', 'x-circle', 'alert-circle', 'info-circle'],
    outline: ['check', 'x', 'alert-triangle', 'info']
  },

  // Animation configurations
  animations: {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    ping: 'animate-ping',
    wiggle: 'animate-wiggle'
  }
};

// Helper function to get icon name from alias
export function resolveIconName(name: string): string {
  return ICON_CONFIG.aliases[name as keyof typeof ICON_CONFIG.aliases] || name;
}

// Helper function to get icons by category
export function getIconsByCategory(category: keyof typeof ICON_CONFIG.categories): string[] {
  return ICON_CONFIG.categories[category] || [];
}

// Helper function to check if icon exists
export function isValidIcon(name: string): boolean {
  const resolvedName = resolveIconName(name);
  // This would check against the actual icon set
  return true; // Placeholder - implement actual validation
}

// Helper function to get icon size
export function getIconSize(size?: number | string): number {
  if (typeof size === 'number') return size;
  if (typeof size === 'string') {
    const numSize = parseInt(size);
    return isNaN(numSize) ? ICON_CONFIG.defaultSize : numSize;
  }
  return ICON_CONFIG.defaultSize;
}

// Helper function to get stroke width
export function getStrokeWidth(width?: number): number {
  return width || ICON_CONFIG.defaultStrokeWidth;
}