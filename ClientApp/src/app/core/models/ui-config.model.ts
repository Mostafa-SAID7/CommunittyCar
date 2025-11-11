// UI Configuration Models for Shadcn/ui-style components

export interface ButtonConfig {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  customClass?: string;
}

export interface InputConfig {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'error';
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  customClass?: string;
}

export interface CardConfig {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'default' | 'sm' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  fullWidth?: boolean;
  customClass?: string;
  header?: {
    title?: string;
    subtitle?: string;
    avatar?: string;
    actions?: any[];
  };
  footer?: {
    actions?: any[];
    content?: any;
  };
}

export interface ModalConfig {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'danger' | 'warning' | 'info' | 'success';
  closable?: boolean;
  backdrop?: 'static' | 'blur' | 'transparent';
  position?: 'center' | 'top' | 'bottom';
  animation?: 'fade' | 'slide' | 'scale' | 'bounce';
  customClass?: string;
}

export interface ToastConfig {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  duration?: number;
  persistent?: boolean;
  closable?: boolean;
  action?: {
    label: string;
    variant?: 'default' | 'outline';
    callback: () => void;
  };
  customClass?: string;
}

export interface DropdownConfig {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  align?: 'start' | 'center' | 'end';
  trigger?: 'click' | 'hover';
  disabled?: boolean;
  customClass?: string;
  items?: DropdownItem[];
}

export interface DropdownItem {
  label: string;
  value?: any;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  children?: DropdownItem[];
  action?: () => void;
}

export interface SheetConfig {
  variant?: 'default' | 'elevated' | 'outlined';
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: string | number;
  snapPoints?: (string | number)[];
  closable?: boolean;
  backdrop?: 'blur' | 'transparent' | 'none';
  animation?: 'slide' | 'fade' | 'scale';
  customClass?: string;
}

export interface AvatarConfig {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
  clickable?: boolean;
  customClass?: string;
}

export interface BadgeConfig {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'pill' | 'square' | 'circle';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  dot?: boolean;
  pulse?: boolean;
  customClass?: string;
}

export interface ProgressConfig {
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  striped?: boolean;
  animated?: boolean;
  customClass?: string;
}

export interface SpinnerConfig {
  variant?: 'default' | 'primary' | 'secondary' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  speed?: 'slow' | 'normal' | 'fast';
  thickness?: 'thin' | 'normal' | 'thick';
  customClass?: string;
}

export interface AlertConfig {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  closable?: boolean;
  icon?: string | boolean;
  action?: {
    label: string;
    callback: () => void;
  };
  customClass?: string;
}

export interface TabsConfig {
  variant?: 'default' | 'pills' | 'underline' | 'buttons';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
  customClass?: string;
}

export interface AccordionConfig {
  variant?: 'default' | 'bordered' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  multiple?: boolean;
  collapsible?: boolean;
  customClass?: string;
}

export interface TableConfig {
  variant?: 'default' | 'bordered' | 'striped' | 'hover';
  size?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
  selectable?: boolean;
  sortable?: boolean;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
  };
  customClass?: string;
}

export interface FormConfig {
  variant?: 'default' | 'floating' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  layout?: 'vertical' | 'horizontal' | 'inline';
  validation?: 'onChange' | 'onBlur' | 'onSubmit';
  showErrors?: boolean;
  customClass?: string;
}

export interface TooltipConfig {
  variant?: 'default' | 'dark' | 'light' | 'colored';
  size?: 'sm' | 'md' | 'lg';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  animation?: 'fade' | 'scale' | 'slide';
  customClass?: string;
}

export interface PopoverConfig {
  variant?: 'default' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  trigger?: 'click' | 'hover' | 'focus';
  closable?: boolean;
  backdrop?: boolean;
  animation?: 'fade' | 'scale' | 'slide';
  customClass?: string;
}

export interface DrawerConfig {
  variant?: 'default' | 'elevated' | 'outlined';
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: string | number;
  closable?: boolean;
  backdrop?: 'blur' | 'transparent' | 'none';
  animation?: 'slide' | 'fade' | 'scale';
  customClass?: string;
}

export interface SkeletonConfig {
  variant?: 'default' | 'rounded' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  customClass?: string;
}

export interface BreadcrumbConfig {
  variant?: 'default' | 'arrows' | 'bullets' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  separator?: string | boolean;
  maxItems?: number;
  showHome?: boolean;
  customClass?: string;
}

export interface PaginationConfig {
  variant?: 'default' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'square' | 'circle';
  showEdges?: boolean;
  showPages?: boolean;
  maxPages?: number;
  customClass?: string;
}

export interface StepperConfig {
  variant?: 'default' | 'numbered' | 'icons' | 'dots';
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  linear?: boolean;
  alternativeLabel?: boolean;
  customClass?: string;
}

export interface CarouselConfig {
  variant?: 'default' | 'dots' | 'arrows' | 'thumbnails';
  height?: string | number;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  showThumbnails?: boolean;
  slidesPerView?: number;
  spaceBetween?: number;
  customClass?: string;
}

export interface CalendarConfig {
  variant?: 'default' | 'minimal' | 'modern';
  size?: 'sm' | 'md' | 'lg';
  selectionMode?: 'single' | 'multiple' | 'range';
  showWeekNumbers?: boolean;
  showAdjacentMonths?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  customClass?: string;
}

export interface DatePickerConfig {
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  format?: string;
  placeholder?: string;
  clearable?: boolean;
  timePicker?: boolean;
  range?: boolean;
  customClass?: string;
}

export interface TimePickerConfig {
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  format?: string;
  placeholder?: string;
  clearable?: boolean;
  use12Hours?: boolean;
  customClass?: string;
}

export interface ColorPickerConfig {
  variant?: 'default' | 'compact' | 'full';
  format?: 'hex' | 'rgb' | 'hsl' | 'hsv';
  showPalette?: boolean;
  showInput?: boolean;
  showAlpha?: boolean;
  customClass?: string;
}

export interface FileUploadConfig {
  variant?: 'default' | 'drag-drop' | 'button';
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  showPreview?: boolean;
  showProgress?: boolean;
  customClass?: string;
}

export interface RatingConfig {
  variant?: 'star' | 'heart' | 'thumb' | 'custom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  max?: number;
  precision?: number;
  readonly?: boolean;
  showValue?: boolean;
  customClass?: string;
  icons?: {
    empty: string;
    half: string;
    full: string;
  };
}

export interface SliderConfig {
  variant?: 'default' | 'range' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  showMarks?: boolean;
  marks?: { value: number; label: string }[];
  customClass?: string;
}

export interface SwitchConfig {
  variant?: 'default' | 'ios' | 'android' | 'material';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  customClass?: string;
}

export interface RadioConfig {
  variant?: 'default' | 'button' | 'card';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  customClass?: string;
}

export interface CheckboxConfig {
  variant?: 'default' | 'switch' | 'toggle';
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
  disabled?: boolean;
  customClass?: string;
}

export interface SelectConfig {
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  creatable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  customClass?: string;
}

export interface TextareaConfig {
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  rows?: number;
  autoResize?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  maxlength?: number;
  showCount?: boolean;
  customClass?: string;
}

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  typography: {
    fontFamily: {
      sans: string;
      serif: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    fontWeight: {
      thin: string;
      light: string;
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
      black: string;
    };
  };
}

// Global UI Configuration
export interface GlobalUIConfig {
  theme: ThemeConfig;
  components: {
    button: ButtonConfig;
    input: InputConfig;
    card: CardConfig;
    modal: ModalConfig;
    toast: ToastConfig;
    dropdown: DropdownConfig;
    sheet: SheetConfig;
    avatar: AvatarConfig;
    badge: BadgeConfig;
    progress: ProgressConfig;
    spinner: SpinnerConfig;
    alert: AlertConfig;
    tabs: TabsConfig;
    accordion: AccordionConfig;
    table: TableConfig;
    form: FormConfig;
    tooltip: TooltipConfig;
    popover: PopoverConfig;
    drawer: DrawerConfig;
    skeleton: SkeletonConfig;
    breadcrumb: BreadcrumbConfig;
    pagination: PaginationConfig;
    stepper: StepperConfig;
    carousel: CarouselConfig;
    calendar: CalendarConfig;
    datePicker: DatePickerConfig;
    timePicker: TimePickerConfig;
    colorPicker: ColorPickerConfig;
    fileUpload: FileUploadConfig;
    rating: RatingConfig;
    slider: SliderConfig;
    switch: SwitchConfig;
    radio: RadioConfig;
    checkbox: CheckboxConfig;
    select: SelectConfig;
    textarea: TextareaConfig;
  };
  animations: {
    enabled: boolean;
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      easeIn: string;
      easeOut: string;
      easeInOut: string;
      bounce: string;
      elastic: string;
    };
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  zIndex: {
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    popover: number;
    tooltip: number;
    toast: number;
  };
}