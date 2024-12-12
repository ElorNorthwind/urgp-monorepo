import { CircleCheck, CircleSlash, CircleX, LucideProps } from 'lucide-react';

type StyleData = {
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  iconStyle?: string;
  badgeStyle?: string;
  label?: string;
};

export const operationTypeStyles = {
  7: { icon: CircleSlash, iconStyle: 'text-amber-500' },
  8: { icon: CircleCheck, iconStyle: 'text-emerald-500' },
  9: { icon: CircleX, iconStyle: 'text-rose-500' },
} as Record<number, StyleData>;
