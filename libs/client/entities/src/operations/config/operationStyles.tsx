import { ApproveStatus } from '@urgp/shared/entities';
import {
  Circle,
  CircleCheck,
  CircleSlash,
  CircleX,
  LucideProps,
} from 'lucide-react';

type StyleData = {
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  iconStyle?: string;
  badgeStyle?: string;
  bgStyle?: string;
  fontStyle?: string;
  label?: string;
};

export const operationTypeStyles = {
  1: { icon: Circle, iconStyle: 'text-muted-foreground/40' },
  7: { icon: CircleSlash, iconStyle: 'text-amber-500' },
  8: { icon: CircleCheck, iconStyle: 'text-emerald-500' },
  9: { icon: CircleX, iconStyle: 'text-rose-500' },
} as Record<number, StyleData>;

export const approveStatusStyles = {
  [ApproveStatus.project]: {
    bgStyle: 'bg-slate-50',
    badgeStyle:
      'border-muted-foreground/50 bg-muted-foreground/5 text-muted-foreground',
    fontStyle: 'opacity-70',
    label: 'В проекте',
  },
  [ApproveStatus.pending]: {
    bgStyle: 'bg-slate-50',
    badgeStyle:
      'border-muted-foreground/50 bg-muted-foreground/5 text-muted-foreground',
    fontStyle: 'opacity-70',
    label: 'На согласовании',
  },
  [ApproveStatus.approved]: {
    bgStyle: 'bg-background',
    badgeStyle: 'border-emerald-500/50 bg-emerald-500/5 text-emerald-600',
    fontStyle: '',
    label: 'Согласовано',
  },
  [ApproveStatus.rejected]: {
    bgStyle: 'bg-red-50',
    badgeStyle: 'border-red-500/50 bg-red-500/5 text-red-500',
    fontStyle: 'opacity-70 line-through',
    label: 'Отклонено',
  },
} as Record<ApproveStatus, StyleData>;
