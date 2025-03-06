import { cn } from '@urgp/client/shared';
import { CaseActions, ViewStatus } from '@urgp/shared/entities';
import {
  Circle,
  CircleAlert,
  CircleArrowUp,
  CircleCheck,
  CircleChevronRight,
  CircleDashed,
  CircleDivide,
  CircleDot,
  CircleEllipsis,
  CircleFadingPlus,
  CircleHelp,
  CirclePlay,
  CirclePower,
  CircleSlash,
  CircleStop,
  CircleX,
  Clipboard,
  ClipboardCheck,
  ClipboardList,
  ClipboardMinus,
  ClipboardPaste,
  ClipboardPen,
  ClipboardPenLine,
  ClipboardType,
  ClipboardX,
  LucideProps,
  MessageSquareHeart,
  MessageSquareMore,
  MessageSquarePlus,
  MessageSquareText,
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
  12: { icon: CircleEllipsis, iconStyle: 'text-gray-500' },
  1: { icon: CircleHelp, iconStyle: 'text-slate-500' },
  2: { icon: CircleChevronRight, iconStyle: 'text-blue-500' },
  3: { icon: CirclePlay, iconStyle: 'text-sky-500' },
  4: { icon: CircleDivide, iconStyle: 'text-cyan-500' },
  5: { icon: CircleSlash, iconStyle: 'text-amber-500' },
  6: { icon: CircleCheck, iconStyle: 'text-emerald-500' },
  7: { icon: CircleX, iconStyle: 'text-pink-500' },
  8: { icon: CircleArrowUp, iconStyle: 'text-stone-500' },
  9: { icon: CirclePower, iconStyle: 'text-indigo-500' },
  10: { icon: CircleStop, iconStyle: 'text-red-500' },
  11: { icon: CircleAlert, iconStyle: 'text-orange-500' },
} as Record<number, StyleData>;

export const caseTypeStyles = {
  1: { icon: MessageSquareX, iconStyle: 'text-rose-500' },
  2: { icon: MessageSquareHeart, iconStyle: 'text-teal-500' },
  3: { icon: MessageSquarePlus, iconStyle: 'text-violet-500' },
  4: { icon: MessageSquareMore, iconStyle: 'text-slate-500' },
  5: { icon: MessageSquareText, iconStyle: 'text-indigo-500' },
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
} as Record<ViewStatus, StyleData>;

export const pendingActionStyles = {
  unknown: { icon: Clipboard, label: 'Неизвестно' },
  [CaseActions.caseApprove]: {
    icon: ClipboardPen,
    label: 'Рассмотреть проект',
  },
  [CaseActions.operationApprove]: {
    icon: ClipboardPenLine,
    label: 'Рассмотреть решение',
  },
  [CaseActions.caseRejected]: {
    icon: ClipboardMinus,
    label: 'Отработать отказ',
  },
  [CaseActions.caseProject]: {
    icon: ClipboardPaste,
    label: 'Завершить проект',
  },
  [CaseActions.reminderDone]: {
    icon: ClipboardCheck,
    label: 'Оценить решение',
  },
  [CaseActions.reminderOverdue]: {
    icon: ClipboardX,
    label: 'Срок напоминания',
  },
  [CaseActions.escalation]: { icon: ClipboardType, label: 'Дать заключение' },
  [CaseActions.controlToMe]: {
    icon: ClipboardList,
    label: 'Отработать поручение',
  },
} as Record<CaseActions, StyleData>;

export const directionCategoryStyles = {
  УРЖП: {
    icon: Circle,
    iconStyle: 'bg-blue-500 rounded-full text-blue-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-blue-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-blue-500 before:mr-1",
    ),
  },
  УВЖУ: {
    icon: Circle,
    iconStyle: 'bg-teal-500 rounded-full text-teal-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-teal-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-teal-500 before:mr-1",
    ),
  },
  УПГУ: {
    icon: Circle,
    iconStyle: 'bg-orange-500 rounded-full text-orange-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-orange-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-orange-500 before:mr-1",
    ),
  },
  УП: {
    icon: Circle,
    iconStyle: 'bg-rose-500 rounded-full text-rose-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-rose-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-rose-500 before:mr-1",
    ),
  },
  УОЖП: {
    icon: Circle,
    iconStyle: 'bg-purple-500 rounded-full text-purple-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-purple-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-purple-500 before:mr-1",
    ),
  },
  УИ: {
    icon: Circle,
    iconStyle: 'bg-lime-500 rounded-full text-lime-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-lime-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-lime-500 before:mr-1",
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
