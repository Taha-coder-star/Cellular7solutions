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
  CalendarCheck,
  Search,
  ShoppingCart,
  User,
  X,
  Menu,
  Monitor,
  Battery,
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
  'calendar-check':    CalendarCheck,
  search:              Search,
  'shopping-cart':     ShoppingCart,
  user:                User,
  x:                   X,
  menu:                Menu,
  monitor:             Monitor,
  battery:             Battery,
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
