import { createSelector, createCombinedSelector, createFilteredSelector, createFindSelector } from './signal-selectors';
import { UiSignalStore } from './ui.store';
import { ModalState, NotificationState } from '../../state/ui/ui.state';

/**
 * UI selectors for accessing UI state
 */

// Basic state selectors
export const selectUiState = (store: UiSignalStore) => store.select(state => state);
export const selectTheme = (store: UiSignalStore) => store.select(state => state.theme);
export const selectLoading = (store: UiSignalStore) => store.select(state => state.loading);
export const selectUiIsLoading = (store: UiSignalStore) => store.select(state => state.loading.isLoading);
export const selectLoadingMessage = (store: UiSignalStore) => store.select(state => state.loading.message);
export const selectModals = (store: UiSignalStore) => store.select(state => state.modals);
export const selectNotifications = (store: UiSignalStore) => store.select(state => state.notifications);
export const selectNavigation = (store: UiSignalStore) => store.select(state => state.navigation);
export const selectResponsive = (store: UiSignalStore) => store.select(state => state.responsive);

// Theme selectors
export const selectEffectiveTheme = (store: UiSignalStore) => store.select(() => store.getEffectiveTheme());
export const selectIsDarkTheme = (store: UiSignalStore) => store.select(() => store.getEffectiveTheme() === 'dark');
export const selectIsLightTheme = (store: UiSignalStore) => store.select(() => store.getEffectiveTheme() === 'light');

// Loading selectors
export const selectLoadingCount = (store: UiSignalStore) => store.select(state => state.loading.count);
export const selectHasLoadingMessage = (store: UiSignalStore) => store.select(state => !!state.loading.message);

// Modal selectors
export const selectModalCount = (store: UiSignalStore) => store.select(state => state.modals.length);
export const selectHasOpenModals = (store: UiSignalStore) => store.select(state => state.modals.length > 0);
export const selectTopModal = (store: UiSignalStore) => store.select(state => state.modals[state.modals.length - 1] || null);
export const selectModalById = (modalId: string) => (store: UiSignalStore) =>
  createFindSelector(selectModals(store), modal => modal.id === modalId);
export const selectModalsByType = (type: string) => (store: UiSignalStore) =>
  createFilteredSelector(selectModals(store), modal => modal.type === type);

// Notification selectors
export const selectNotificationCount = (store: UiSignalStore) => store.select(state => state.notifications.length);
export const selectHasNotifications = (store: UiSignalStore) => store.select(state => state.notifications.length > 0);
export const selectNotificationsByType = (type: NotificationState['type']) => (store: UiSignalStore) =>
  createFilteredSelector(selectNotifications(store), notification => notification.type === type);
export const selectPersistentNotifications = (store: UiSignalStore) =>
  createFilteredSelector(selectNotifications(store), notification => notification.persistent ?? false);
export const selectRecentNotifications = (store: UiSignalStore) =>
  store.select(state => state.notifications.slice(-5)); // Last 5 notifications

// Navigation selectors
export const selectCurrentRoute = (store: UiSignalStore) => store.select(state => state.navigation.currentRoute);
export const selectBreadcrumbs = (store: UiSignalStore) => store.select(state => state.navigation.breadcrumbs);
export const selectBreadcrumbCount = (store: UiSignalStore) => store.select(state => state.navigation.breadcrumbs.length);
export const selectSidebarOpen = (store: UiSignalStore) => store.select(state => state.navigation.sidebarOpen);
export const selectMobileMenuOpen = (store: UiSignalStore) => store.select(state => state.navigation.mobileMenuOpen);
export const selectActiveTab = (store: UiSignalStore) => store.select(state => state.navigation.activeTab);

// Responsive selectors
export const selectScreenSize = (store: UiSignalStore) => store.select(state => state.responsive.screenSize);
export const selectIsMobile = (store: UiSignalStore) => store.select(state => state.responsive.isMobile);
export const selectIsTablet = (store: UiSignalStore) => store.select(state => state.responsive.isTablet);
export const selectIsDesktop = (store: UiSignalStore) => store.select(state => state.responsive.isDesktop);
export const selectScreenWidth = (store: UiSignalStore) => store.select(state => state.responsive.width);
export const selectScreenHeight = (store: UiSignalStore) => store.select(state => state.responsive.height);

// Combined selectors
export const selectUiStatus = (store: UiSignalStore) => createCombinedSelector(
  [selectUiIsLoading(store), selectHasOpenModals(store), selectHasNotifications(store)],
  (isLoading, hasOpenModals, hasNotifications) => ({
    isLoading,
    hasOpenModals,
    hasNotifications,
    isBusy: isLoading || hasOpenModals
  })
);

export const selectNavigationStatus = (store: UiSignalStore) => createCombinedSelector(
  [selectSidebarOpen(store), selectMobileMenuOpen(store), selectIsMobile(store)],
  (sidebarOpen, mobileMenuOpen, isMobile) => ({
    sidebarOpen,
    mobileMenuOpen,
    isMobile,
    hasOpenMenus: sidebarOpen || mobileMenuOpen
  })
);

export const selectResponsiveInfo = (store: UiSignalStore) => createCombinedSelector(
  [selectScreenSize(store), selectIsMobile(store), selectIsTablet(store), selectIsDesktop(store)],
  (screenSize, isMobile, isTablet, isDesktop) => ({
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  })
);

export const selectNotificationSummary = (store: UiSignalStore) => createCombinedSelector(
  [selectNotifications(store)],
  (notifications) => {
    const counts = notifications.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {} as Record<NotificationState['type'], number>);

    return {
      total: notifications.length,
      success: counts.success || 0,
      error: counts.error || 0,
      warning: counts.warning || 0,
      info: counts.info || 0,
      hasErrors: (counts.error || 0) > 0,
      hasWarnings: (counts.warning || 0) > 0
    };
  }
);

// Utility selectors
export const selectCanShowSidebar = (store: UiSignalStore) => createCombinedSelector(
  [selectIsDesktop(store), selectSidebarOpen(store)],
  (isDesktop, sidebarOpen) => isDesktop && sidebarOpen
);

export const selectShouldShowMobileMenu = (store: UiSignalStore) => createCombinedSelector(
  [selectIsMobile(store), selectMobileMenuOpen(store)],
  (isMobile, mobileMenuOpen) => isMobile && mobileMenuOpen
);