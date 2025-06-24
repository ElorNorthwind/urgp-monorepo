import { cn } from '@urgp/client/shared';
import { Circle, LucideProps } from 'lucide-react';

export type StyleData = {
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  iconStyle?: string;
  badgeStyle?: string;
  label?: string;
};

const mosotdelStyle = {
  icon: Circle,
  iconStyle: cn('bg-blue-500 rounded-full text-blue-500'),
  badgeStyle: cn(
    'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-blue-500',
    "before:content-[''] before:rounded-full before:size-3 before:bg-blue-500 before:mr-1",
  ),
};

const foundationStyle = {
  icon: Circle,
  iconStyle: cn('bg-rose-500 rounded-full text-rose-500'),
  badgeStyle: cn(
    'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-rose-500',
    "before:content-[''] before:rounded-full before:size-3 before:bg-rose-500 before:mr-1",
  ),
};

export const equityBuildingStyles = {
  0: foundationStyle,
  1: mosotdelStyle,
  2: mosotdelStyle,
  3: mosotdelStyle,
} as Record<string, StyleData>;
