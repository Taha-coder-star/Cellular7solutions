import {
  Smartphone,
  Laptop,
  Headphones,
  TabletSmartphone,
  Gamepad2,
  Plug,
  Clock,
  ShieldCheck,
  Wrench,
  Truck,
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Search,
  ShoppingCart,
  User,
  X,
  Menu,
  Monitor,
  Battery,
  BatteryCharging,
  Camera,
  Droplets,
  DollarSign,
  Users,
  Star,
  Check,
  ChevronDown,
  Globe,
  MessageSquare,
  Share2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Volume2,
  ZoomIn,
  LogOut,
  Heart,
  Bell,
  SlidersHorizontal,
  Settings,
  Package,
  ShoppingBag,
  Recycle,
} from 'lucide-react';

const ICONS = {
  smartphone:          Smartphone,
  laptop:              Laptop,
  headphones:          Headphones,
  'tablet-smartphone': TabletSmartphone,
  'gamepad-2':         Gamepad2,
  plug:                Plug,
  clock:               Clock,
  'shield-check':      ShieldCheck,
  wrench:              Wrench,
  truck:               Truck,
  'arrow-right':       ArrowRight,
  'arrow-up-right':    ArrowUpRight,
  'calendar-check':    CalendarCheck,
  search:              Search,
  'shopping-cart':     ShoppingCart,
  user:                User,
  x:                   X,
  menu:                Menu,
  monitor:             Monitor,
  battery:             Battery,
  'battery-charging':  BatteryCharging,
  camera:              Camera,
  droplets:            Droplets,
  'dollar-sign':       DollarSign,
  users:               Users,
  star:                Star,
  check:             Check,
  'chevron-down':    ChevronDown,
  globe:             Globe,
  'message-square':  MessageSquare,
  'share-2':         Share2,
  mail:              Mail,
  lock:              Lock,
  eye:               Eye,
  'eye-off':         EyeOff,
  'chevron-left':    ChevronLeft,
  'chevron-right':   ChevronRight,
  'check-circle':    CheckCircle2,
  speaker:           Volume2,
  'zoom-in':         ZoomIn,
  'log-out':         LogOut,
  heart:             Heart,
  bell:              Bell,
  sliders:           SlidersHorizontal,
  settings:          Settings,
  package:           Package,
  'shopping-bag':    ShoppingBag,
  recycle:           Recycle,
};

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 2, style = {}, ...rest }) {
  const IconComponent = ICONS[name];
  const baseStyle = { display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style };

  if (!IconComponent) {
    return <svg width={size} height={size} style={baseStyle} />;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={baseStyle}
      {...rest}
    />
  );
}
