import { Injectable } from '@angular/core';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  // Framer Motion-style animations for Angular
  static fadeIn = trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms ease-in', style({ opacity: 1 }))
    ])
  ]);

  static slideInFromLeft = trigger('slideInFromLeft', [
    transition(':enter', [
      style({ transform: 'translateX(-100%)', opacity: 0 }),
      animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ transform: 'translateX(0)', opacity: 1 }))
    ])
  ]);

  static slideInFromRight = trigger('slideInFromRight', [
    transition(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 }),
      animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ transform: 'translateX(0)', opacity: 1 }))
    ])
  ]);

  static slideInFromBottom = trigger('slideInFromBottom', [
    transition(':enter', [
      style({ transform: 'translateY(100%)', opacity: 0 }),
      animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ transform: 'translateY(0)', opacity: 1 }))
    ])
  ]);

  static scaleIn = trigger('scaleIn', [
    transition(':enter', [
      style({ transform: 'scale(0.8)', opacity: 0 }),
      animate('300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        style({ transform: 'scale(1)', opacity: 1 }))
    ])
  ]);

  static bounceIn = trigger('bounceIn', [
    transition(':enter', [
      style({ transform: 'scale(0.3)', opacity: 0 }),
      animate('500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        style({ transform: 'scale(1)', opacity: 1 }))
    ])
  ]);

  static staggerList = trigger('staggerList', [
    transition(':enter', [
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        stagger(100, [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ], { optional: true })
    ])
  ]);

  static pulse = trigger('pulse', [
    state('active', style({ transform: 'scale(1.05)' })),
    transition('inactive <=> active', animate('200ms ease-in-out'))
  ]);

  static shake = trigger('shake', [
    transition(':enter', [
      style({ transform: 'translateX(0)' }),
      animate('600ms ease-in-out', style({ transform: 'translateX(0)' })),
      animate('100ms', style({ transform: 'translateX(-10px)' })),
      animate('100ms', style({ transform: 'translateX(10px)' })),
      animate('100ms', style({ transform: 'translateX(-10px)' })),
      animate('100ms', style({ transform: 'translateX(10px)' })),
      animate('100ms', style({ transform: 'translateX(0)' }))
    ])
  ]);

  // Page transition animations
  static pageTransition = trigger('pageTransition', [
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
  static modalEnter = trigger('modalEnter', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.9) translateY(-20px)' }),
      animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95) translateY(-10px)' }))
    ])
  ]);

  // Card hover animations
  static cardHover = trigger('cardHover', [
    state('idle', style({ transform: 'translateY(0)' })),
    state('hover', style({ transform: 'translateY(-8px)' })),
    transition('idle <=> hover', animate('200ms ease-in-out'))
  ]);

  // Loading animations
  static loadingDots = trigger('loadingDots', [
    transition(':enter', [
      query(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        stagger(100, [
          animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
        ])
      ])
    ])
  ]);

  // Notification animations
  static notificationSlide = trigger('notificationSlide', [
    state('in', style({ transform: 'translateX(0)', opacity: 1 })),
    transition('void => *', [
      style({ transform: 'translateX(100%)', opacity: 0 }),
      animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)')
    ]),
    transition('* => void', [
      animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
    ])
  ]);

  // Button animations
  static buttonPress = trigger('buttonPress', [
    transition(':active', [
      style({ transform: 'scale(0.95)' }),
      animate('100ms ease-in-out')
    ])
  ]);

  // Form field animations
  static formFieldFocus = trigger('formFieldFocus', [
    state('focused', style({
      transform: 'scale(1.02)',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    })),
    transition('idle <=> focused', animate('200ms ease-in-out'))
  ]);

  // Tab animations
  static tabSwitch = trigger('tabSwitch', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(10px)' }),
      animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
    ])
  ]);

  // Dropdown animations
  static dropdownSlide = trigger('dropdownSlide', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(-10px) scale(0.95)' }),
      animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
    ]),
    transition(':leave', [
      animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-5px) scale(0.95)' }))
    ])
  ]);

  // Tooltip animations
  static tooltipFade = trigger('tooltipFade', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.8)' }),
      animate('200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ opacity: 1, transform: 'scale(1)' }))
    ]),
    transition(':leave', [
      animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
    ])
  ]);

  // Progress bar animations
  static progressFill = trigger('progressFill', [
    transition(':enter', [
      style({ width: '0%' }),
      animate('{{ duration }}ms ease-out', style({ width: '100%' }))
    ])
  ]);

  // Skeleton loading animations
  static skeletonPulse = trigger('skeletonPulse', [
    state('loading', style({ opacity: 0.5 })),
    transition('idle <=> loading', animate('1000ms ease-in-out'))
  ]);

  // Accordion animations
  static accordionExpand = trigger('accordionExpand', [
    state('collapsed', style({ height: '0px', opacity: 0 })),
    state('expanded', style({ height: '*', opacity: 1 })),
    transition('collapsed <=> expanded', animate('300ms ease-in-out'))
  ]);

  // Carousel slide animations
  static carouselSlide = trigger('carouselSlide', [
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

  // Ripple effect for buttons
  static ripple = trigger('ripple', [
    transition(':enter', [
      style({ transform: 'scale(0)', opacity: 1 }),
      animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ transform: 'scale(4)', opacity: 0 }))
    ])
  ]);

  // Floating action button animations
  static fabFloat = trigger('fabFloat', [
    state('idle', style({ transform: 'translateY(0)' })),
    state('hover', style({ transform: 'translateY(-4px)' })),
    transition('idle <=> hover', animate('200ms ease-in-out'))
  ]);

  // Drawer/Sidebar animations
  static drawerSlide = trigger('drawerSlide', [
    state('closed', style({ transform: 'translateX(-100%)' })),
    state('open', style({ transform: 'translateX(0)' })),
    transition('closed <=> open', animate('300ms ease-in-out'))
  ]);

  // Toast stack animations
  static toastStack = trigger('toastStack', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(100%)' }),
      animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
    ])
  ]);

  // Search input animations
  static searchExpand = trigger('searchExpand', [
    state('collapsed', style({ width: '40px' })),
    state('expanded', style({ width: '300px' })),
    transition('collapsed <=> expanded', animate('300ms ease-in-out'))
  ]);

  // Badge animations
  static badgePulse = trigger('badgePulse', [
    state('normal', style({ transform: 'scale(1)' })),
    state('pulse', style({ transform: 'scale(1.2)' })),
    transition('normal <=> pulse', animate('300ms ease-in-out'))
  ]);

  // Stepper animations
  static stepperProgress = trigger('stepperProgress', [
    transition(':enter', [
      style({ width: '0%' }),
      animate('500ms ease-out', style({ width: '{{ progress }}%' }))
    ])
  ]);

  // Chart animations
  static chartBar = trigger('chartBar', [
    transition(':enter', [
      style({ height: '0%' }),
      animate('800ms ease-out', style({ height: '{{ height }}%' }))
    ])
  ]);

  // Image lazy load animations
  static imageLoad = trigger('imageLoad', [
    state('loading', style({ opacity: 0.3 })),
    state('loaded', style({ opacity: 1 })),
    transition('loading => loaded', animate('300ms ease-in'))
  ]);

  // Scroll-triggered animations
  static scrollReveal = trigger('scrollReveal', [
    state('hidden', style({ opacity: 0, transform: 'translateY(50px)' })),
    state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
    transition('hidden => visible', animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'))
  ]);

  // Parallax animations
  static parallax = trigger('parallax', [
    state('start', style({ transform: 'translateY(0)' })),
    state('end', style({ transform: 'translateY(-100px)' })),
    transition('start <=> end', animate('1000ms ease-out'))
  ]);

  // Morphing animations
  static morph = trigger('morph', [
    state('circle', style({ borderRadius: '50%', width: '100px', height: '100px' })),
    state('square', style({ borderRadius: '0', width: '200px', height: '200px' })),
    transition('circle <=> square', animate('500ms ease-in-out'))
  ]);

  // Text typing animations
  static textType = trigger('textType', [
    transition(':enter', [
      query(':enter', [
        style({ width: '0' }),
        animate('{{ duration }}ms steps({{ steps }}, end)', style({ width: '100%' }))
      ], { optional: true })
    ])
  ]);

  // Flip animations
  static flip = trigger('flip', [
    transition(':enter', [
      style({ transform: 'rotateY(90deg)', opacity: 0 }),
      animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ transform: 'rotateY(0deg)', opacity: 1 }))
    ])
  ]);

  // Rotate animations
  static rotateIn = trigger('rotateIn', [
    transition(':enter', [
      style({ transform: 'rotate(-180deg)', opacity: 0 }),
      animate('500ms ease-out', style({ transform: 'rotate(0deg)', opacity: 1 }))
    ])
  ]);

  // Glow animations
  static glow = trigger('glow', [
    state('normal', style({ boxShadow: 'none' })),
    state('glow', style({ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' })),
    transition('normal <=> glow', animate('300ms ease-in-out'))
  ]);

  // Elastic animations
  static elastic = trigger('elastic', [
    transition(':enter', [
      style({ transform: 'scale(0)' }),
      animate('800ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        style({ transform: 'scale(1)' }))
    ])
  ]);

  // Swing animations
  static swing = trigger('swing', [
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

  // Wobble animations
  static wobble = trigger('wobble', [
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

  // Jello animations
  static jello = trigger('jello', [
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

  // Heartbeat animations
  static heartbeat = trigger('heartbeat', [
    state('normal', style({ transform: 'scale(1)' })),
    state('beat', style({ transform: 'scale(1.1)' })),
    transition('normal <=> beat', animate('300ms ease-in-out'))
  ]);

  // Blink animations
  static blink = trigger('blink', [
    state('visible', style({ opacity: 1 })),
    state('hidden', style({ opacity: 0 })),
    transition('visible <=> hidden', animate('500ms ease-in-out'))
  ]);

  // Fade slide animations
  static fadeSlideUp = trigger('fadeSlideUp', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(30px)' }),
      animate('500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-30px)' }))
    ])
  ]);

  static fadeSlideDown = trigger('fadeSlideDown', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(-30px)' }),
      animate('500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(30px)' }))
    ])
  ]);

  static fadeSlideLeft = trigger('fadeSlideLeft', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(30px)' }),
      animate('500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ opacity: 1, transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
      animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-30px)' }))
    ])
  ]);

  static fadeSlideRight = trigger('fadeSlideRight', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(-30px)' }),
      animate('500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ opacity: 1, transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
      animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(30px)' }))
    ])
  ]);

  // Zoom animations
  static zoomIn = trigger('zoomIn', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.3)' }),
      animate('500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ opacity: 1, transform: 'scale(1)' }))
    ]),
    transition(':leave', [
      animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.3)' }))
    ])
  ]);

  static zoomOut = trigger('zoomOut', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(1.3)' }),
      animate('500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ opacity: 1, transform: 'scale(1)' }))
    ]),
    transition(':leave', [
      animate('300ms ease-in', style({ opacity: 0, transform: 'scale(1.3)' }))
    ])
  ]);

  // Bounce animations
  static bounceInUp = trigger('bounceInUp', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(2000px)' }),
      animate('1000ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        style({ opacity: 1, transform: 'translateY(0)' }))
    ])
  ]);

  static bounceInDown = trigger('bounceInDown', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(-2000px)' }),
      animate('1000ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        style({ opacity: 1, transform: 'translateY(0)' }))
    ])
  ]);

  static bounceInLeft = trigger('bounceInLeft', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(-2000px)' }),
      animate('1000ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        style({ opacity: 1, transform: 'translateX(0)' }))
    ])
  ]);

  static bounceInRight = trigger('bounceInRight', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(2000px)' }),
      animate('1000ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        style({ opacity: 1, transform: 'translateX(0)' }))
    ])
  ]);

  // Rubber band animation
  static rubberBand = trigger('rubberBand', [
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
  static lightSpeedIn = trigger('lightSpeedIn', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(100%) skewX(-30deg)' }),
      animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0) skewX(0deg)' }))
    ])
  ]);

  static lightSpeedOut = trigger('lightSpeedOut', [
    transition(':leave', [
      animate('600ms ease-in', style({ opacity: 0, transform: 'translateX(100%) skewX(30deg)' }))
    ])
  ]);

  // Rolling animations
  static rollIn = trigger('rollIn', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(-100%) rotate(-120deg)' }),
      animate('1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ opacity: 1, transform: 'translateX(0) rotate(0deg)' }))
    ])
  ]);

  static rollOut = trigger('rollOut', [
    transition(':leave', [
      animate('1000ms ease-in', style({ opacity: 0, transform: 'translateX(100%) rotate(120deg)' }))
    ])
  ]);

  constructor() { }

  // Utility methods for dynamic animations
  createFadeInAnimation(duration: number = 300): any {
    return trigger('dynamicFadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(`${duration}ms ease-in`, style({ opacity: 1 }))
      ])
    ]);
  }

  createSlideInAnimation(direction: 'left' | 'right' | 'up' | 'down', duration: number = 400): any {
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    };

    return trigger('dynamicSlideIn', [
      transition(':enter', [
        style({ transform: transforms[direction], opacity: 0 }),
        animate(`${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
          style({ transform: 'translate(0)', opacity: 1 }))
      ])
    ]);
  }

  createScaleAnimation(scale: number = 0.8, duration: number = 300): any {
    return trigger('dynamicScale', [
      transition(':enter', [
        style({ transform: `scale(${scale})`, opacity: 0 }),
        animate(`${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]);
  }

  createStaggerAnimation(staggerDelay: number = 100, duration: number = 300): any {
    return trigger('dynamicStagger', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(staggerDelay, [
            animate(`${duration}ms ease-out`, style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]);
  }
}