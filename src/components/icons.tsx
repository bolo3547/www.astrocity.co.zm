import {
  Sun,
  Droplets,
  CircleDot,
  Gauge,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Menu,
  X,
  Check,
  ArrowRight,
  MessageCircle,
  Shield,
  Award,
  Users,
  Wrench,
  Zap,
  Home,
  Building2,
  Tractor,
  Cylinder,
  Search,
  FileText,
  type LucideIcon,
} from 'lucide-react';

export const Icons = {
  sun: Sun,
  droplets: Droplets,
  circleDot: CircleDot,
  gauge: Gauge,
  phone: Phone,
  mail: Mail,
  mapPin: MapPin,
  clock: Clock,
  chevronRight: ChevronRight,
  menu: Menu,
  x: X,
  check: Check,
  arrowRight: ArrowRight,
  messageCircle: MessageCircle,
  shield: Shield,
  award: Award,
  users: Users,
  wrench: Wrench,
  zap: Zap,
  home: Home,
  building: Building2,
  tractor: Tractor,
  cylinder: Cylinder,
  drill: CircleDot,
  search: Search,
  fileText: FileText,
} as const;

// Service-specific icons mapping
export const serviceIcons: Record<string, LucideIcon> = {
  pump: Droplets,
  drill: CircleDot,
  tank: Cylinder,
  solar: Sun,
  default: Zap,
};

export const getServiceIcon = (iconName: string | null | undefined): LucideIcon => {
  if (!iconName) return serviceIcons.default;
  return serviceIcons[iconName] || serviceIcons.default;
};
