import {
  LucideProps,
  MessageSquareHeart,
  MessageSquareMore,
  MessageSquarePlus,
  MessageSquareX,
} from 'lucide-react';

type StyleData = {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  className?: string;
};

export const caseTypeStyles = {
  1: { icon: MessageSquareX, className: 'text-rose-500' },
  2: { icon: MessageSquareHeart, className: 'text-teal-500' },
  3: { icon: MessageSquarePlus, className: 'text-violet-500' },
  4: { icon: MessageSquareMore, className: 'text-slate-500' },
} as Record<number, StyleData>;
