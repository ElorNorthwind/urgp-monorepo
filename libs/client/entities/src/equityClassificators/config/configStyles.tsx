import { cn } from '@urgp/client/shared';
import { EquityObjectProblems } from '@urgp/shared/entities';
import {
  Building,
  Building2,
  Car,
  Circle,
  CircleCheck,
  CircleUser,
  CircleUserRound,
  Construction,
  House,
  LucideProps,
  Package,
  ShieldCheck,
  ShieldEllipsis,
} from 'lucide-react';

export type StyleData = {
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  iconStyle?: string;
  badgeStyle?: string;
  label?: string;
};

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
  1: { icon: CircleUserRound, iconStyle: cn('text-yellow-500') },
  2: { icon: CircleUser, iconStyle: cn('text-orange-500') },
  3: { icon: CircleCheck, iconStyle: cn('text-emerald-500') },
  4: { icon: ShieldEllipsis, iconStyle: cn('text-gray-500') },
  5: { icon: ShieldCheck, iconStyle: cn('text-blue-500') },
} as Record<number, StyleData>;

export const equityObjectTypeStyles = {
  1: { icon: House, iconStyle: cn('text-green-500') },
  2: { icon: Car, iconStyle: cn('text-indigo-500') },
  3: { icon: Package, iconStyle: cn('text-stone-500') },
} as Record<number, StyleData>;

export const equityProblemsStyles = {
  [EquityObjectProblems.unidentified]: {
    icon: House,
    iconStyle: cn('text-amber-500'),
  },
  [EquityObjectProblems.defects]: {
    icon: House,
    iconStyle: cn('text-fuchsia-500'),
  },
  [EquityObjectProblems['double-sell']]: {
    icon: House,
    iconStyle: cn('text-red-500'),
  },
} as Record<string, StyleData>;
