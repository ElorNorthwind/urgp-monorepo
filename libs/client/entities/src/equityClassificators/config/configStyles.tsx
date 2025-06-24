import { cn } from '@urgp/client/shared';
import { EquityObjectProblems } from '@urgp/shared/entities';
import {
  Badge,
  BadgeAlert,
  BadgeQuestionMark,
  BadgeRussianRuble,
  Building,
  Building2,
  Car,
  Circle,
  CircleCheck,
  CircleEllipsis,
  CircleUser,
  CircleUserRound,
  Construction,
  DoorOpen,
  House,
  LucideProps,
  Package,
  ShieldCheck,
  ShieldEllipsis,
} from 'lucide-react';
import { StyleData } from '../../cases';

const mosotdelStyle = {
  icon: Building,
  // iconStyle: cn('bg-blue-500 rounded-full text-blue-500'),
  iconStyle: cn('text-blue-500'),
  badgeStyle: cn(
    'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-blue-500',
    "before:content-[''] before:rounded-full before:size-3 before:bg-blue-500 before:mr-1",
  ),
};

const mosotdelConstructionStyle = {
  icon: Construction,
  // iconStyle: cn('bg-blue-500 rounded-full text-blue-500'),
  iconStyle: cn('text-gray-500'),
  badgeStyle: cn(
    'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-blue-500',
    "before:content-[''] before:rounded-full before:size-3 before:bg-blue-500 before:mr-1",
  ),
};

const foundationStyle = {
  icon: Building,
  // iconStyle: cn('bg-rose-500 rounded-full text-rose-500'),
  iconStyle: cn('text-emerald-500'),
  badgeStyle: cn(
    'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-emerald-500',
    "before:content-[''] before:rounded-full before:size-3 before:bg-emerald-500 before:mr-1",
  ),
};

const foundationConstractionStyle = {
  icon: Construction,
  // iconStyle: cn('bg-rose-500 rounded-full text-rose-500'),
  iconStyle: cn('text-gray-500'),
  badgeStyle: cn(
    'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-emerald-500',
    "before:content-[''] before:rounded-full before:size-3 before:bg-emerald-500 before:mr-1",
  ),
};

export const equityBuildingStyles = {
  fond_done: foundationStyle,
  fond_construction: foundationConstractionStyle,
  ao_done: mosotdelStyle,
  ao_construction: mosotdelConstructionStyle,
} as Record<string, StyleData>;

export const equityObjectStatusStyles = {
  1: { icon: CircleEllipsis, iconStyle: cn('text-yellow-500') },
  2: { icon: CircleCheck, iconStyle: cn('text-orange-500') },
  3: { icon: CircleUserRound, iconStyle: cn('text-emerald-500') },
  4: { icon: ShieldEllipsis, iconStyle: cn('text-gray-500') },
  5: { icon: ShieldCheck, iconStyle: cn('text-blue-500') },
} as Record<number, StyleData>;

export const equityObjectTypeStyles = {
  1: { icon: DoorOpen, iconStyle: cn('text-teal-500'), label: 'кв.' },
  2: { icon: Car, iconStyle: cn('text-indigo-500'), label: 'мм.' },
  3: { icon: Package, iconStyle: cn('text-stone-500'), label: 'пом.' },
} as Record<number, StyleData>;

export const equityProblemsStyles = {
  [EquityObjectProblems.unidentified]: {
    icon: BadgeQuestionMark,
    iconStyle: cn('text-amber-500'),
    label: 'Не опознано',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-amber-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-amber-500 before:mr-1",
    ),
  },
  [EquityObjectProblems.defects]: {
    icon: BadgeAlert,
    iconStyle: cn('text-fuchsia-500'),
    label: 'Дефекты',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-fuchsia-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-fuchsia-500 before:mr-1",
    ),
  },
  [EquityObjectProblems['double-sell']]: {
    icon: BadgeRussianRuble,
    iconStyle: cn('text-red-500'),
    label: 'Двойная продажа',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-red-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-red-500 before:mr-1",
    ),
  },
  none: {
    icon: Badge,
    iconStyle: cn('text-slate-500'),
    label: 'Двойная продажа',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-slate-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-slate-500 before:mr-1",
    ),
  },
} as Record<string, StyleData>;
