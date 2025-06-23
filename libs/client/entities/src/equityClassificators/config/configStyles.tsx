import { cn } from '@urgp/client/shared';
import {
  CaseActions,
  ControlToMeStatus,
  ViewStatus,
} from '@urgp/shared/entities';
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
  MessageSquareDashed,
  MessageSquareHeart,
  MessageSquareMore,
  MessageSquarePlus,
  MessageSquareReply,
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

export const equityBuildingStyles = {
  'АО "Мосотделстрой 1"': {
    icon: Circle,
    iconStyle: 'bg-blue-500 rounded-full text-blue-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-blue-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-blue-500 before:mr-1",
    ),
  },
  'Фонд защиты прав дольщиков': {
    icon: Circle,
    iconStyle: 'bg-rose-500 rounded-full text-rose-500',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-rose-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-rose-500 before:mr-1",
    ),
  },
} as Record<string, StyleData>;
