export type ThemeMode = 'light' | 'dark' | 'system';
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ModalState {
  id: string;
  type: string;
  title?: string;
  content?: any;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  data?: any;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
  timestamp: Date;
}

export interface NavigationState {
  currentRoute: string;
  breadcrumbs: Array<{
    label: string;
    path: string;
    icon?: string;
  }>;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  activeTab?: string;
}

export interface ResponsiveState {
  screenSize: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

export interface UiState {
  theme: ThemeMode;
  language: string;
  loading: {
    isLoading: boolean;
    message?: string;
    count: number; // For multiple concurrent loading operations
  };
  modals: ModalState[];
  notifications: NotificationState[];
  navigation: NavigationState;
  responsive: ResponsiveState;
}

export const initialUiState: UiState = {
  theme: 'system',
  language: 'en',
  loading: {
    isLoading: false,
    message: undefined,
    count: 0
  },
  modals: [],
  notifications: [],
  navigation: {
    currentRoute: '/',
    breadcrumbs: [],
    sidebarOpen: false,
    mobileMenuOpen: false
  },
  responsive: {
    screenSize: 'md',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024,
    height: 768
  }
};