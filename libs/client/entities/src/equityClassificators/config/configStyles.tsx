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
  CirclePlay,
  CircleUser,
  CircleUserRound,
  Construction,
  DoorOpen,
  HandCoins,
  House,
  LucideProps,
  Package,
  ShieldCheck,
  ShieldEllipsis,
  Square,
  SquareAsterisk,
  SquareCheck,
  SquareDashedBottom,
  SquareDashedBottomCode,
  SquarePen,
  SquaresIntersect,
  SquareUserRound,
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
  1: { icon: CircleEllipsis, iconStyle: cn('text-stone-500') },
  7: { icon: CirclePlay, iconStyle: cn('text-yellow-500') },
  2: { icon: CircleCheck, iconStyle: cn('text-orange-500') },
  3: { icon: CircleUserRound, iconStyle: cn('text-emerald-500') },
  4: { icon: ShieldEllipsis, iconStyle: cn('text-gray-500') },
  5: { icon: ShieldCheck, iconStyle: cn('text-blue-500') },
} as Record<number, StyleData>;

export const equityClaimItemTypeStyles = {
  1: { icon: DoorOpen, iconStyle: cn('text-teal-500') },
  2: { icon: Car, iconStyle: cn('text-indigo-500') },
  3: { icon: HandCoins, iconStyle: cn('text-amber-500') },
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
      "before:content-[''] before:rounded-full before:size-3 before:bg-amber-500 before:mr-1 before:flex-shrink-0",
    ),
  },
  [EquityObjectProblems.defects]: {
    icon: BadgeAlert,
    iconStyle: cn('text-fuchsia-500'),
    label: 'Дефекты',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-fuchsia-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-fuchsia-500 before:mr-1 before:flex-shrink-0",
    ),
  },
  [EquityObjectProblems['double-sell']]: {
    icon: BadgeRussianRuble,
    iconStyle: cn('text-red-500'),
    label: 'Двойная продажа',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-red-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-red-500 before:mr-1 before:flex-shrink-0",
    ),
  },
  none: {
    icon: Badge,
    iconStyle: cn('text-slate-500'),
    label: 'Двойная продажа',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-slate-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-slate-500 before:mr-1 before:flex-shrink-0",
    ),
  },
} as Record<string, StyleData>;

export const equityOperationTypeStyles = {
  0: { icon: Square, iconStyle: cn('text-slate-500') }, // Фолбэк
  1: { icon: SquareCheck, iconStyle: cn('text-teal-500') }, // Акт Подписан
  2: { icon: SquareDashedBottom, iconStyle: cn('text-orange-500') }, // Дефектная ведомость открыта
  3: { icon: SquareDashedBottomCode, iconStyle: cn('text-cyan-500') }, // Дефектная ведомость закрыта
  4: { icon: CircleUser, iconStyle: cn('text-teal-500') }, // Дефекты выявлены
  5: { icon: SquareUserRound, iconStyle: cn('text-indigo-500') }, // Запись на прием
  6: { icon: SquareAsterisk, iconStyle: cn('text-yellow-500') }, // Заключение УРЖП запрошено
  7: { icon: SquarePen, iconStyle: cn('text-blue-500') }, // Заключение УРЖП дано
  8: { icon: SquaresIntersect, iconStyle: cn('text-red-500') }, // Выявлены признаки двойной продажи
} as Record<number, StyleData>;
