import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

// Framer Motion-style Angular animations
// These are reusable animation triggers that can be imported and used across components

// Motion Presets - Framer Motion style configurations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: 'easeIn' }
};

export const fadeOut = {
  initial: { opacity: 1 },
  animate: { opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

// Angular trigger equivalent for fadeIn
export const fadeInTrigger = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-in', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-out', style({ opacity: 0 }))
  ])
]);

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
};

export const fadeInUpTrigger = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
  ])
]);

export const fadeInDown = trigger('fadeInDown', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-20px)' }),
    animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
  ])
]);

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
};

export const fadeInLeftTrigger = trigger('fadeInLeft', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-20px)' }),
    animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' }))
  ])
]);

export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
};

export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
};

export const staggerAnimation = trigger('staggerAnimation', [
  transition(':enter', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const counterAnimation = trigger('counterAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.5)' }),
    animate('800ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

export const toastAnimation = trigger('toastAnimation', [
  state('in', style({ transform: 'translateX(0) scale(1)', opacity: 1 })),
  transition('void => *', [
    style({ transform: 'translateX(100%) scale(0.8)', opacity: 0 }),
    animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)')
  ]),
  transition('* => void', [
    animate('300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ transform: 'translateX(100%) scale(0.8)', opacity: 0 }))
  ])
]);

export const progressAnimation = trigger('progressAnimation', [
  state('start', style({ width: '100%' })),
  state('end', style({ width: '0%' })),
  transition('start => end', animate('{{ duration }}ms linear'))
]);

export const fadeInRight = trigger('fadeInRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(20px)' }),
    animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-20px)' }))
  ])
]);

// Scale animations
export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }
};

export const scaleInTrigger = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate('300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
  ])
]);

export const scaleInBounce = trigger('scaleInBounce', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.3)' }),
    animate('500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

// Slide animations
export const slideInFromLeft = trigger('slideInFromLeft', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
  ])
]);

export const slideInFromRight = trigger('slideInFromRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
  ])
]);

export const slideInFromTop = trigger('slideInFromTop', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(-100%)' }))
  ])
]);

export const slideInFromBottom = trigger('slideInFromBottom', [
  transition(':enter', [
    style({ transform: 'translateY(100%)' }),
    animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(100%)' }))
  ])
]);

// Bounce animations
export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] }
};

export const bounceInTrigger = trigger('bounceIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.3)' }),
    animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

export const bounceInUp = trigger('bounceInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(2000px)' }),
    animate('1000ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const bounceInDown = trigger('bounceInDown', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-2000px)' }),
    animate('1000ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

// Rotate animations
export const rotateIn = trigger('rotateIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'rotate(-180deg)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'rotate(0deg)' }))
  ])
]);

export const rotateInDownLeft = trigger('rotateInDownLeft', [
  transition(':enter', [
    style({ opacity: 0, transform: 'rotate(-90deg)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'rotate(0deg)' }))
  ])
]);

// Flip animations
export const flipInX = trigger('flipInX', [
  transition(':enter', [
    style({ opacity: 0, transform: 'rotateX(90deg)' }),
    animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ opacity: 1, transform: 'rotateX(0deg)' }))
  ])
]);

export const flipInY = trigger('flipInY', [
  transition(':enter', [
    style({ opacity: 0, transform: 'rotateY(90deg)' }),
    animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ opacity: 1, transform: 'rotateY(0deg)' }))
  ])
]);

// Zoom animations
export const zoomIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
};

export const zoomInTrigger = trigger('zoomIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.3)' }),
    animate('500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.3)' }))
  ])
]);

export const zoomInUp = trigger('zoomInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.3) translateY(100%)' }),
    animate('500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
  ])
]);

export const zoomInDown = trigger('zoomInDown', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.3) translateY(-100%)' }),
    animate('500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
  ])
]);

// Elastic animations
export const elasticIn = trigger('elasticIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0)' }),
    animate('800ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

// Jello animation
export const jello = trigger('jello', [
  transition(':enter', [
    animate('1000ms ease-in-out', style({ transform: 'scale(1)' })),
    animate('120ms', style({ transform: 'scale(1.25, 0.75)' })),
    animate('120ms', style({ transform: 'scale(0.75, 1.25)' })),
    animate('120ms', style({ transform: 'scale(1.15, 0.85)' })),
    animate('120ms', style({ transform: 'scale(0.95, 1.05)' })),
    animate('120ms', style({ transform: 'scale(1.05, 0.95)' })),
    animate('120ms', style({ transform: 'scale(1)' }))
  ])
]);

// Pulse animation
export const pulse = trigger('pulse', [
  state('normal', style({ transform: 'scale(1)' })),
  state('pulse', style({ transform: 'scale(1.05)' })),
  transition('normal <=> pulse', animate('300ms ease-in-out'))
]);

// Shake animations
export const shake = trigger('shake', [
  transition(':enter', [
    style({ transform: 'translateX(0)' }),
    animate('600ms ease-in-out', style({ transform: 'translateX(0)' })),
    animate('100ms', style({ transform: 'translateX(-10px)' })),
    animate('100ms', style({ transform: 'translateX(10px)' })),
    animate('100ms', style({ transform: 'translateX(-10px)' })),
    animate('100ms', style({ transform: 'translateX(10px)' })),
    animate('100ms', style({ transform: 'translateX(-10px)' })),
    animate('100ms', style({ transform: 'translateX(10px)' })),
    animate('100ms', style({ transform: 'translateX(0)' }))
  ])
]);

export const shakeX = trigger('shakeX', [
  transition(':enter', [
    animate('1000ms ease-in-out', style({ transform: 'translateX(0)' })),
    animate('150ms', style({ transform: 'translateX(-25%)' })),
    animate('300ms', style({ transform: 'translateX(20%)' })),
    animate('300ms', style({ transform: 'translateX(-15%)' })),
    animate('300ms', style({ transform: 'translateX(10%)' })),
    animate('300ms', style({ transform: 'translateX(-5%)' })),
    animate('150ms', style({ transform: 'translateX(0)' }))
  ])
]);

// Wobble animation
export const wobble = trigger('wobble', [
  transition(':enter', [
    animate('1000ms ease-in-out', style({ transform: 'translateX(0)' })),
    animate('150ms', style({ transform: 'translateX(-25%)' })),
    animate('300ms', style({ transform: 'translateX(20%)' })),
    animate('300ms', style({ transform: 'translateX(-15%)' })),
    animate('300ms', style({ transform: 'translateX(10%)' })),
    animate('300ms', style({ transform: 'translateX(-5%)' })),
    animate('150ms', style({ transform: 'translateX(0)' }))
  ])
]);

// Swing animation
export const swing = trigger('swing', [
  transition(':enter', [
    style({ transformOrigin: 'top center' }),
    animate('1000ms ease-in-out', style({ transform: 'rotate(0deg)' })),
    animate('200ms', style({ transform: 'rotate(15deg)' })),
    animate('400ms', style({ transform: 'rotate(-10deg)' })),
    animate('400ms', style({ transform: 'rotate(5deg)' })),
    animate('400ms', style({ transform: 'rotate(-2deg)' })),
    animate('200ms', style({ transform: 'rotate(0deg)' }))
  ])
]);

// Rubber band animation
export const rubberBand = trigger('rubberBand', [
  transition(':enter', [
    animate('1000ms ease-in-out', style({ transform: 'scale(1)' })),
    animate('100ms', style({ transform: 'scale(1.25, 0.75)' })),
    animate('100ms', style({ transform: 'scale(0.75, 1.25)' })),
    animate('100ms', style({ transform: 'scale(1.15, 0.85)' })),
    animate('100ms', style({ transform: 'scale(0.95, 1.05)' })),
    animate('100ms', style({ transform: 'scale(1.05, 0.95)' })),
    animate('100ms', style({ transform: 'scale(1)' }))
  ])
]);

// Light speed animations
export const lightSpeedIn = trigger('lightSpeedIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(100%) skewX(-30deg)' }),
    animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0) skewX(0deg)' }))
  ])
]);

export const lightSpeedOut = trigger('lightSpeedOut', [
  transition(':leave', [
    animate('600ms ease-in', style({ opacity: 0, transform: 'translateX(100%) skewX(30deg)' }))
  ])
]);

// Rolling animations
export const rollIn = trigger('rollIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-100%) rotate(-120deg)' }),
    animate('1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ opacity: 1, transform: 'translateX(0) rotate(0deg)' }))
  ])
]);

export const rollOut = trigger('rollOut', [
  transition(':leave', [
    animate('1000ms ease-in', style({ opacity: 0, transform: 'translateX(100%) rotate(120deg)' }))
  ])
]);

// Stagger animations
export const staggerFadeIn = trigger('staggerFadeIn', [
  transition(':enter', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const staggerScaleIn = trigger('staggerScaleIn', [
  transition(':enter', [
    query(':enter', [
      style({ opacity: 0, transform: 'scale(0.8)' }),
      stagger(100, [
        animate('300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ], { optional: true })
  ])
]);

export const staggerSlideIn = trigger('staggerSlideIn', [
  transition(':enter', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(-50px)' }),
      stagger(100, [
        animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ], { optional: true })
  ])
]);

// Page transition animations
export const pageTransition = trigger('pageTransition', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(100%)' })
    ], { optional: true }),
    query(':leave', [
      animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(-100%)' }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ], { optional: true })
  ])
]);

// Modal animations
export const modalEnter = trigger('modalEnter', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.9) translateY(-20px)' }),
    animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95) translateY(-10px)' }))
  ])
]);

// Drawer animations
export const drawerSlide = trigger('drawerSlide', [
  state('closed', style({ transform: 'translateX(-100%)' })),
  state('open', style({ transform: 'translateX(0)' })),
  transition('closed <=> open', animate('300ms ease-in-out'))
]);

export const drawerSlideRight = trigger('drawerSlideRight', [
  state('closed', style({ transform: 'translateX(100%)' })),
  state('open', style({ transform: 'translateX(0)' })),
  transition('closed <=> open', animate('300ms ease-in-out'))
]);

export const drawerSlideTop = trigger('drawerSlideTop', [
  state('closed', style({ transform: 'translateY(-100%)' })),
  state('open', style({ transform: 'translateY(0)' })),
  transition('closed <=> open', animate('300ms ease-in-out'))
]);

export const drawerSlideBottom = trigger('drawerSlideBottom', [
  state('closed', style({ transform: 'translateY(100%)' })),
  state('open', style({ transform: 'translateY(0)' })),
  transition('closed <=> open', animate('300ms ease-in-out'))
]);

// Sheet animations
export const sheetSlideBottom = trigger('sheetSlideBottom', [
  state('closed', style({ transform: 'translateY(100%)' })),
  state('open', style({ transform: 'translateY(0)' })),
  transition('closed <=> open', animate('300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'))
]);

export const sheetSlideTop = trigger('sheetSlideTop', [
  state('closed', style({ transform: 'translateY(-100%)' })),
  state('open', style({ transform: 'translateY(0)' })),
  transition('closed <=> open', animate('300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'))
]);

// Toast animations
export const toastSlideIn = trigger('toastSlideIn', [
  state('in', style({ transform: 'translateX(0)', opacity: 1 })),
  transition('void => *', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)')
  ]),
  transition('* => void', [
    animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
  ])
]);

export const toastSlideInTop = trigger('toastSlideInTop', [
  state('in', style({ transform: 'translateY(0)', opacity: 1 })),
  transition('void => *', [
    style({ transform: 'translateY(-100%)', opacity: 0 }),
    animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)')
  ]),
  transition('* => void', [
    animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
  ])
]);

// Dropdown animations
export const dropdownSlide = trigger('dropdownSlide', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-10px) scale(0.95)' }),
    animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-5px) scale(0.95)' }))
  ])
]);

// Tooltip animations
export const tooltipFade = trigger('tooltipFade', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate('200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
  ])
]);

// Popover animations
export const popoverFade = trigger('popoverFade', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.9)' }),
    animate('200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
  ])
]);

// Card animations
export const cardHover = trigger('cardHover', [
  state('idle', style({ transform: 'translateY(0)' })),
  state('hover', style({ transform: 'translateY(-8px)' })),
  transition('idle <=> hover', animate('200ms ease-in-out'))
]);

export const cardFlip = trigger('cardFlip', [
  state('front', style({ transform: 'rotateY(0deg)' })),
  state('back', style({ transform: 'rotateY(180deg)' })),
  transition('front <=> back', animate('600ms ease-in-out'))
]);

// Button animations
export const buttonPress = trigger('buttonPress', [
  transition(':active', [
    style({ transform: 'scale(0.95)' }),
    animate('100ms ease-in-out')
  ])
]);

export const buttonGlow = trigger('buttonGlow', [
  state('normal', style({ boxShadow: 'none' })),
  state('glow', style({ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' })),
  transition('normal <=> glow', animate('300ms ease-in-out'))
]);

// Loading animations
export const loadingDots = trigger('loadingDots', [
  transition(':enter', [
    query(':enter', [
      style({ opacity: 0, transform: 'scale(0)' }),
      stagger(100, [
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ])
]);

export const loadingPulse = trigger('loadingPulse', [
  state('loading', style({ opacity: 0.5 })),
  transition('idle <=> loading', animate('1000ms ease-in-out'))
]);

// Progress bar animations
export const progressFill = trigger('progressFill', [
  transition(':enter', [
    style({ width: '0%' }),
    animate('{{ duration }}ms ease-out', style({ width: '100%' }))
  ])
]);

// Skeleton animations
export const skeletonPulse = trigger('skeletonPulse', [
  state('loading', style({ opacity: 0.5 })),
  state('loaded', style({ opacity: 1 })),
  transition('loading <=> loaded', animate('300ms ease-in'))
]);

// Accordion animations
export const accordionExpand = trigger('accordionExpand', [
  state('collapsed', style({ height: '0px', opacity: 0 })),
  state('expanded', style({ height: '*', opacity: 1 })),
  transition('collapsed <=> expanded', animate('300ms ease-in-out'))
]);

// Tab animations
export const tabSwitch = trigger('tabSwitch', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
  ])
]);

// Carousel animations
export const carouselSlide = trigger('carouselSlide', [
  transition(':increment', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(100%)' }),
      animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ], { optional: true }),
    query(':leave', [
      animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
    ], { optional: true })
  ]),
  transition(':decrement', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(-100%)' }),
      animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ], { optional: true }),
    query(':leave', [
      animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
    ], { optional: true })
  ])
]);

// Ripple effect
export const ripple = trigger('ripple', [
  transition(':enter', [
    style({ transform: 'scale(0)', opacity: 1 }),
    animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({ transform: 'scale(4)', opacity: 0 }))
  ])
]);

// Floating action button
export const fabFloat = trigger('fabFloat', [
  state('idle', style({ transform: 'translateY(0)' })),
  state('hover', style({ transform: 'translateY(-4px)' })),
  transition('idle <=> hover', animate('200ms ease-in-out'))
]);

// Scroll-triggered animations
export const scrollReveal = trigger('scrollReveal', [
  state('hidden', style({ opacity: 0, transform: 'translateY(50px)' })),
  state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
  transition('hidden => visible', animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'))
]);

// Parallax animations
export const parallax = trigger('parallax', [
  state('start', style({ transform: 'translateY(0)' })),
  state('end', style({ transform: 'translateY(-100px)' })),
  transition('start <=> end', animate('1000ms ease-out'))
]);

// Morphing animations
export const morph = trigger('morph', [
  state('circle', style({ borderRadius: '50%', width: '100px', height: '100px' })),
  state('square', style({ borderRadius: '0', width: '200px', height: '200px' })),
  transition('circle <=> square', animate('500ms ease-in-out'))
]);

// Text animations
export const textType = trigger('textType', [
  transition(':enter', [
    query(':enter', [
      style({ width: '0' }),
      animate('{{ duration }}ms steps({{ steps }}, end)', style({ width: '100%' }))
    ], { optional: true })
  ])
]);

export const textGlow = trigger('textGlow', [
  state('normal', style({ textShadow: 'none' })),
  state('glow', style({ textShadow: '0 0 10px rgba(59, 130, 246, 0.8)' })),
  transition('normal <=> glow', animate('300ms ease-in-out'))
]);

// Image animations
export const imageLoad = trigger('imageLoad', [
  state('loading', style({ opacity: 0.3 })),
  state('loaded', style({ opacity: 1 })),
  transition('loading => loaded', animate('300ms ease-in'))
]);

export const imageZoom = trigger('imageZoom', [
  state('normal', style({ transform: 'scale(1)' })),
  state('zoom', style({ transform: 'scale(1.1)' })),
  transition('normal <=> zoom', animate('300ms ease-in-out'))
]);

// Badge animations
export const badgePulse = trigger('badgePulse', [
  state('normal', style({ transform: 'scale(1)' })),
  state('pulse', style({ transform: 'scale(1.2)' })),
  transition('normal <=> pulse', animate('300ms ease-in-out'))
]);

// Stepper animations
export const stepperProgress = trigger('stepperProgress', [
  transition(':enter', [
    style({ width: '0%' }),
    animate('500ms ease-out', style({ width: '{{ progress }}%' }))
  ])
]);

// Chart animations
export const chartBar = trigger('chartBar', [
  transition(':enter', [
    style({ height: '0%' }),
    animate('800ms ease-out', style({ height: '{{ height }}%' }))
  ])
]);

// Form field animations
export const formFieldFocus = trigger('formFieldFocus', [
  state('focused', style({
    transform: 'scale(1.02)',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  })),
  transition('idle <=> focused', animate('200ms ease-in-out'))
]);

// Search animations
export const searchExpand = trigger('searchExpand', [
  state('collapsed', style({ width: '40px' })),
  state('expanded', style({ width: '300px' })),
  transition('collapsed <=> expanded', animate('300ms ease-in-out'))
]);

// Notification animations
export const notificationSlide = trigger('notificationSlide', [
  state('in', style({ transform: 'translateX(0)', opacity: 1 })),
  transition('void => *', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)')
  ]),
  transition('* => void', [
    animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
  ])
]);

// Complex animations combining multiple effects
export const complexEnter = trigger('complexEnter', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(50px) rotate(-5deg) scale(0.8)'
    }),
    animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      style({
        opacity: 1,
        transform: 'translateY(0) rotate(0deg) scale(1)'
      }))
  ])
]);

export const slideInOut = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
  ])
]);

export const messageAnimation = trigger('messageAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const bounceAndGlow = trigger('bounceAndGlow', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.3)' }),
    animate('500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      style({ opacity: 1, transform: 'scale(1)' })),
    animate('300ms', style({ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' })),
    animate('300ms', style({ boxShadow: 'none' }))
  ])
]);

// Motion presets collection
export const motionPresets = {
  fadeIn,
  fadeInUp,
  fadeInLeft,
  slideInLeft,
  slideInRight,
  scaleIn,
  bounceIn,
  zoomIn
};

// Export all animations as a collection
export const allAnimations = [
  fadeInTrigger, fadeInUpTrigger, fadeInDown, fadeInLeftTrigger, fadeInRight,
  scaleInTrigger, scaleInBounce,
  slideInFromLeft, slideInFromRight, slideInFromTop, slideInFromBottom,
  bounceInTrigger, bounceInUp, bounceInDown,
  rotateIn, rotateInDownLeft,
  flipInX, flipInY,
  zoomInTrigger, zoomInUp, zoomInDown,
  elasticIn, jello,
  pulse, shake, shakeX, wobble, swing, rubberBand,
  lightSpeedIn, lightSpeedOut,
  rollIn, rollOut,
  staggerFadeIn, staggerScaleIn, staggerSlideIn,
  pageTransition, modalEnter,
  drawerSlide, drawerSlideRight, drawerSlideTop, drawerSlideBottom,
  sheetSlideBottom, sheetSlideTop,
  toastSlideIn, toastSlideInTop,
  dropdownSlide, tooltipFade, popoverFade,
  cardHover, cardFlip,
  buttonPress, buttonGlow,
  loadingDots, loadingPulse,
  progressFill, skeletonPulse,
  accordionExpand, tabSwitch,
  carouselSlide, ripple, fabFloat,
  scrollReveal, parallax, morph,
  textType, textGlow,
  imageLoad, imageZoom,
  badgePulse, stepperProgress, chartBar,
  formFieldFocus, searchExpand,
  notificationSlide,
  complexEnter, bounceAndGlow
];