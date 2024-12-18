import { CircleCheck, CircleSlash, CircleX, LucideProps } from 'lucide-react';

type StyleData = {
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  iconStyle?: string;
  badgeStyle?: string;
  fontStyle?: string;
  label?: string;
};

export const operationTypeStyles = {
  7: { icon: CircleSlash, iconStyle: 'text-amber-500' },
  8: { icon: CircleCheck, iconStyle: 'text-emerald-500' },
  9: { icon: CircleX, iconStyle: 'text-rose-500' },
} as Record<number, StyleData>;

export const approveStatusStyles = {
  pending: {
    badgeStyle: 'bg-slate-50',
    fontStyle: 'opacity-70',
    label: 'На согласовании',
  },
  approved: {
    badgeStyle: 'bg-background',
    fontStyle: '',
    label: 'Согласовано',
  },
  rejected: {
    badgeStyle: 'bg-red-50',
    fontStyle: 'opacity-70 line-through',
    label: 'Отклонено',
  },
} as Record<string, StyleData>;
