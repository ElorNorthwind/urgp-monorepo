import { cn } from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import {
  Circle,
  CircleArrowUp,
  CircleCheck,
  CircleDashed,
  CircleDivide,
  CircleFadingPlus,
  CircleHelp,
  CirclePlay,
  CircleSlash,
  CircleStop,
  CircleX,
  Clipboard,
  ClipboardCheck,
  ClipboardMinus,
  ClipboardPen,
  ClipboardPenLine,
  ClipboardX,
  LucideProps,
  MessageSquareHeart,
  MessageSquareMore,
  MessageSquarePlus,
  MessageSquareX,
} from 'lucide-react';

export type StyleData = {
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  iconStyle?: string;
  badgeStyle?: string;
  label?: string;
};

export const caseStatusStyles = {
  1: { icon: CircleHelp, iconStyle: 'text-slate-500' },
  2: { icon: CirclePlay, iconStyle: 'text-sky-500' },
  3: { icon: CirclePlay, iconStyle: 'text-sky-500' },
  4: { icon: CircleDivide, iconStyle: 'text-sky-500' },
  5: { icon: CircleSlash, iconStyle: 'text-amber-500' },
  6: { icon: CircleCheck, iconStyle: 'text-emerald-500' },
  7: { icon: CircleX, iconStyle: 'text-rose-500' },
  10: { icon: CircleStop, iconStyle: 'text-red-500' },
} as Record<number, StyleData>;

export const caseTypeStyles = {
  1: { icon: MessageSquareX, iconStyle: 'text-rose-500' },
  2: { icon: MessageSquareHeart, iconStyle: 'text-teal-500' },
  3: { icon: MessageSquarePlus, iconStyle: 'text-violet-500' },
  4: { icon: MessageSquareMore, iconStyle: 'text-slate-500' },
} as Record<number, StyleData>;

export const viewStatusStyles = {
  unwatched: {
    icon: CircleDashed,
    iconStyle: 'text-foreground',
    badgeStyle: 'hidden',
  },
  unchanged: {
    icon: Circle,
    iconStyle: 'text-var(--foreground)',
    badgeStyle: 'hidden',
  },
  changed: {
    icon: CircleArrowUp,
    iconStyle: 'text-foreground',
    badgeStyle: 'bg-stone-400',
  },
  new: {
    icon: CircleFadingPlus,
    iconStyle: 'text-foreground',
    badgeStyle: 'bg-stone-600',
  },
} as Record<Case['viewStatus'], StyleData>;

export const pendingActionStyles = {
  unknown: { icon: Clipboard },
  'case-approve': { icon: ClipboardPen },
  'both-approve': { icon: ClipboardPen },
  'operation-approve': { icon: ClipboardPenLine },
  'case-rejected': { icon: ClipboardMinus },
  'reminder-done': { icon: ClipboardCheck },
  'reminder-overdue': { icon: ClipboardX },
} as Record<string, StyleData>;

export const directionCategoryStyles = {
  // УРЖП: { badgeStyle: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100' },
  // УВЖУ: { badgeStyle: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
  // УПГУ: { badgeStyle: 'bg-amber-50 border-amber-200 hover:bg-amber-100' },
  // УП: { badgeStyle: 'bg-slate-50 border-slate-200 hover:bg-slate-100' },
  // УОЖП: { badgeStyle: 'bg-violet-50 border-violet-200 hover:bg-violet-100' },
  УРЖП: {
    icon: Circle,
    iconStyle: 'bg-cyan-500 rounded-full text-cyan-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-cyan-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-cyan-500 before:mr-1",
    ),
  },
  УВЖУ: {
    icon: Circle,
    iconStyle: 'bg-emerald-500 rounded-full text-emerald-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-emerald-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-emerald-500 before:mr-1",
    ),
  },
  УПГУ: {
    icon: Circle,
    iconStyle: 'bg-amber-500 rounded-full text-amber-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-amber-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-amber-500 before:mr-1",
    ),
  },
  УП: {
    icon: Circle,
    iconStyle: 'bg-slate-500 rounded-full text-slate-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-slate-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-slate-500 before:mr-1",
    ),
  },
  УОЖП: {
    icon: Circle,
    iconStyle: 'bg-violet-500 rounded-full text-violet-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-violet-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-violet-500 before:mr-1",
    ),
  },
} as Record<string, StyleData>;

export const externalSystemStyles = {
  EDO: { label: 'ЭДО' },
  SPD: { label: 'СПД' },
  SPD2: { label: 'СПД-2' },
  HOTLINE: { label: 'Горячая Линия' },
  CONSULTATION: { label: 'Онлайн-консультация' },
  NONE: { label: 'Устное поручение' },
} as Record<string, StyleData>;
