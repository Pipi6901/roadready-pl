import React from 'react';
import {
  AlarmClock, Bell, Bike, BookOpen, BookOpenCheck, CalendarClock, CalendarX, CarFront, Check,
  CheckCheck, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, CircleParking, CircleX,
  ClipboardCheck, CloudRain, Compass, Crown, Download, Earth, FileText, Flag, Flame, Gauge, Gem,
  GitFork, Globe, Hand, House, Info, Languages, ListChecks, Lock, Map, MapPin, MessageCircle, Milestone,
  Navigation, OctagonAlert, Package, PartyPopper, Play, Pointer, RotateCcw, RotateCw, Route,
  Search, Settings, ShieldCheck, Signpost, Siren, Sparkles, Sprout, Star, Target, Timer,
  TrafficCone, TreePine, TrendingDown, TriangleAlert, Trophy, User, Users, Vibrate, Video, Volume2, X, Zap,
} from 'lucide-react-native';

/**
 * Icons are referenced by their kebab-case lucide name, exactly as they appear
 * in the Pencil mockup. Explicit imports keep tree-shaking working — importing
 * the whole package would pull in 1749 icons.
 */
const ICONS = {
  'alarm-clock': AlarmClock,
  bell: Bell,
  bike: Bike,
  'book-open': BookOpen,
  'book-open-check': BookOpenCheck,
  'calendar-clock': CalendarClock,
  'calendar-x': CalendarX,
  'car-front': CarFront,
  check: Check,
  'check-check': CheckCheck,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-check': CircleCheck,
  'circle-parking': CircleParking,
  'circle-x': CircleX,
  'clipboard-check': ClipboardCheck,
  'cloud-rain': CloudRain,
  compass: Compass,
  crown: Crown,
  download: Download,
  earth: Earth,
  'file-text': FileText,
  flag: Flag,
  flame: Flame,
  gauge: Gauge,
  gem: Gem,
  'git-fork': GitFork,
  globe: Globe,
  hand: Hand,
  house: House,
  info: Info,
  languages: Languages,
  'list-checks': ListChecks,
  lock: Lock,
  map: Map,
  'map-pin': MapPin,
  'message-circle': MessageCircle,
  milestone: Milestone,
  navigation: Navigation,
  'octagon-alert': OctagonAlert,
  package: Package,
  'party-popper': PartyPopper,
  play: Play,
  pointer: Pointer,
  'rotate-ccw': RotateCcw,
  'rotate-cw': RotateCw,
  route: Route,
  search: Search,
  settings: Settings,
  'shield-check': ShieldCheck,
  signpost: Signpost,
  siren: Siren,
  sparkles: Sparkles,
  sprout: Sprout,
  star: Star,
  target: Target,
  timer: Timer,
  'traffic-cone': TrafficCone,
  'tree-pine': TreePine,
  'trending-down': TrendingDown,
  'triangle-alert': TriangleAlert,
  trophy: Trophy,
  user: User,
  users: Users,
  vibrate: Vibrate,
  video: Video,
  'volume-2': Volume2,
  x: X,
  zap: Zap,
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName | string;
  size?: number;
  color: string;
  /** lucide stroke width; the mockup uses the default 2 everywhere. */
  strokeWidth?: number;
  fill?: string;
}

export function Icon({ name, size = 24, color, strokeWidth = 2, fill = 'none' }: IconProps) {
  const Component = ICONS[name as IconName] ?? Signpost;
  return <Component size={size} color={color} strokeWidth={strokeWidth} fill={fill} />;
}

export function hasIcon(name: string): name is IconName {
  return name in ICONS;
}
