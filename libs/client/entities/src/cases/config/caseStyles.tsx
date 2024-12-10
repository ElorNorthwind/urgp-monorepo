import {
  CircleHelp,
  CirclePlay,
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
  2: { icon: CirclePlay, iconStyle: 'test-sky-500' },
  3: { icon: CirclePlay, iconStyle: 'test-sky-500' },
} as Record<number, StyleData>;

export const caseTypeStyles = {
  1: { icon: MessageSquareX, iconStyle: 'text-rose-500' },
  2: { icon: MessageSquareHeart, iconStyle: 'text-teal-500' },
  3: { icon: MessageSquarePlus, iconStyle: 'text-violet-500' },
  4: { icon: MessageSquareMore, iconStyle: 'text-slate-500' },
} as Record<number, StyleData>;

export const directionCategoryStyles = {
  УРЖП: { badgeStyle: 'bg-cyan-50 border-cyan-200' },
  УВЖУ: { badgeStyle: 'bg-emerald-50 border-emerald-200' },
  УПГУ: { badgeStyle: 'bg-amber-50 border-amber-200' },
  УП: { badgeStyle: 'bg-slate-50 border-slate-200' },
  УОЖП: { badgeStyle: 'bg-violet-50 border-violet-200' },
} as Record<string, StyleData>;

export const externalSystemStyles = {
  EDO: { label: 'ЭДО' },
  SPD: { label: 'СПД' },
  SPD2: { label: 'СПД-2' },
  HOTLINE: { label: 'Горячая Линия' },
  CONSULTATION: { label: 'Онлайн-консультация' },
  NONE: { label: 'Устное поручение' },
} as Record<string, StyleData>;
