import React from 'react';
import {
  AlarmClock, ArrowLeftRight, Bell, Bike, Bookmark, BookOpen, BookOpenCheck, Bus, CalendarClock, CalendarX,
  Car, CarFront, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, CircleArrowRight,
  CircleCheck, CircleDot, CircleParking, CircleSlash, CircleX, ClipboardCheck, CloudRain, Compass,
  CornerUpRight, Crown, Download, Earth, FileText, Flag, Flame, Gauge, Gem, GitFork, Globe, Hand,
  HeartPulse, Hourglass, House, Image, Info, Languages, Leaf, ListChecks, Lock, Map, MapPin, MessageCircle,
  Milestone, Navigation, OctagonAlert, Package, PartyPopper, Play, Pointer, RotateCcw, RotateCw,
  Route, Search, Settings, ShieldCheck, Signpost, Siren, Smartphone, Sparkles, Sprout, Star, Target,
  Timer, Tractor, TrafficCone, TramFront, TreePine, TrendingDown, TriangleAlert, Trophy, Truck, User, Users, Vibrate,
  Video, Volume2, Wrench, X, Zap,
} from 'lucide-react-native';

/**
 * Icons are referenced by their kebab-case lucide name, exactly as they appear
 * in the Pencil mockup. Explicit imports keep tree-shaking working — importing
 * the whole package would pull in 1749 icons.
 *
 * A name missing from this map falls back to a signpost — silently. That is
 * how ten of the Polish section icons (car, truck, wrench, heart-pulse…) all
 * rendered as the same signpost for a while: the bundle named them, nothing
 * here knew them. Every icon name used by content or a screen has to be
 * imported and listed below.
 */
const ICONS = {
  'alarm-clock': AlarmClock,
  'arrow-left-right': ArrowLeftRight,
  bell: Bell,
  bike: Bike,
  bookmark: Bookmark,
  'book-open': BookOpen,
  'book-open-check': BookOpenCheck,
  bus: Bus,
  'calendar-clock': CalendarClock,
  'calendar-x': CalendarX,
  car: Car,
  'car-front': CarFront,
  check: Check,
  'check-check': CheckCheck,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-arrow-right': CircleArrowRight,
  'circle-check': CircleCheck,
  'circle-dot': CircleDot,
  'circle-parking': CircleParking,
  'circle-slash': CircleSlash,
  'circle-x': CircleX,
  'clipboard-check': ClipboardCheck,
  'cloud-rain': CloudRain,
  compass: Compass,
  'corner-up-right': CornerUpRight,
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
  'heart-pulse': HeartPulse,
  hourglass: Hourglass,
  house: House,
  info: Info,
  languages: Languages,
  leaf: Leaf,
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
  smartphone: Smartphone,
  sparkles: Sparkles,
  sprout: Sprout,
  star: Star,
  target: Target,
  timer: Timer,
  tractor: Tractor,
  'traffic-cone': TrafficCone,
  'tram-front': TramFront,
  'tree-pine': TreePine,
  'trending-down': TrendingDown,
  'triangle-alert': TriangleAlert,
  trophy: Trophy,
  truck: Truck,
  user: User,
  users: Users,
  vibrate: Vibrate,
  image: Image,
  video: Video,
  'volume-2': Volume2,
  wrench: Wrench,
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
