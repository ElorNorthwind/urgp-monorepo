import {
  CircleHelp,
  CirclePlay,
  CircleStop,
  CircleX,
  LucideProps,
  MessageSquareHeart,
  MessageSquareMore,
  MessageSquarePlus,
  MessageSquareX,
} from 'lucide-react';

type StyleData = {
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
  5: { icon: CircleX, iconStyle: 'text-rose-500' },
} as Record<number, StyleData>;

export const caseTypeStyles = {
  1: { icon: MessageSquareX, iconStyle: 'text-rose-500' },
  2: { icon: MessageSquareHeart, iconStyle: 'text-teal-500' },
  3: { icon: MessageSquarePlus, iconStyle: 'text-violet-500' },
  4: { icon: MessageSquareMore, iconStyle: 'text-slate-500' },
} as Record<number, StyleData>;

export const directionCategoryStyles = {
  // УРЖП: { badgeStyle: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100' },
  // УВЖУ: { badgeStyle: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
  // УПГУ: { badgeStyle: 'bg-amber-50 border-amber-200 hover:bg-amber-100' },
  // УП: { badgeStyle: 'bg-slate-50 border-slate-200 hover:bg-slate-100' },
  // УОЖП: { badgeStyle: 'bg-violet-50 border-violet-200 hover:bg-violet-100' },
  УРЖП: {
    badgeStyle:
      'bg-background border-cyan-500 border px-1 text-cyan-600 hover:bg-cyan-50',
  },
  УВЖУ: {
    badgeStyle:
      'bg-background border-emerald-500 border px-1 text-emerald-600 hover:bg-emerald-50',
  },
  УПГУ: {
    badgeStyle:
      'bg-background border-amber-500 border px-1 text-amber-600 hover:bg-amber-50',
  },
  УП: {
    badgeStyle:
      'bg-background border-slate-500 border px-1 text-slate-600 hover:bg-slate-50',
  },
  УОЖП: {
    badgeStyle:
      'bg-background border-violet-500 border px-1 text-violet-600 hover:bg-violet-50',
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
