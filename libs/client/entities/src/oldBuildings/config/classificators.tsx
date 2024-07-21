import { cn } from '@urgp/client/shared';
import {
  Blocks,
  Building2,
  CalendarCheck,
  CalendarFold,
  CalendarMinus2,
  CalendarRange,
  CalendarX,
  CheckCheck,
  CircleAlert,
  CircleCheck,
  CircleEllipsis,
  CircleX,
  Construction,
  House,
  RefreshCcw,
  RotateCcw,
  Scan,
} from 'lucide-react';

export const relocationTypes = [
  {
    value: 1,
    label: 'Полное переселение',
    icon: House,
  },
  {
    value: 2,
    label: 'Частичное отселение',
    icon: Blocks,
  },
  {
    value: 3,
    label: 'Многоэтапное отселение',
    icon: Building2,
  },
];

export const relocationAge = [
  {
    value: 'Завершено',
    label: 'Завершено',
    icon: CalendarCheck,
    className: cn('text-emerald-500'),
  },
  {
    value: 'Не начато',
    label: 'Не начато',
    icon: CalendarX,
    className: cn('text-slate-500'),
  },
  {
    value: 'Менее месяца',
    label: 'Менее месяца',
    icon: CalendarRange,
    className: cn('text-yellow-400'),
  },
  {
    value: 'От 1 до 2 месяцев',
    label: 'От 1 до 2 месяцев',
    icon: CalendarRange,
    className: cn('text-amber-500'),
  },
  {
    value: 'От 2 до 5 месяцев',
    label: 'От 2 до 5 месяцев',
    icon: CalendarRange,
    className: cn('text-orange-500'),
  },
  {
    value: 'От 5 до 8 месяцев',
    label: 'От 5 до 8 месяцев',
    icon: CalendarRange,
    className: cn('text-rose-400'),
  },
  {
    value: 'Более 8 месяцев',
    label: 'Более 8 месяцев',
    icon: CalendarRange,
    className: cn('text-red-500'),
  },
];

export const relocationDeviations = [
  {
    value: 'Завершено',
    label: 'Завершено',
    icon: CircleCheck,
    className: 'text-emerald-500',
  },
  {
    value: 'Без отклонений',
    label: 'Без отклонений',
    icon: CircleEllipsis,
    className: 'text-blue-500',
  },
  {
    value: 'Требует внимания',
    label: 'Требует внимания',
    icon: CircleAlert,
    className: 'text-yellow-500',
  },
  {
    value: 'Есть риски',
    label: 'Есть риски',
    icon: CircleX,
    className: 'text-red-500',
  },
];

export const relocationStatus = [
  {
    value: 'Завершено',
    label: 'Завершено',
    icon: CheckCheck,
  },
  {
    value: 'Снос',
    label: 'Снос',
    icon: Construction,
  },
  {
    value: 'Отселение',
    label: 'Отселение',
    icon: RefreshCcw,
  },
  {
    value: 'Переселение',
    label: 'Переселение',
    icon: RotateCcw,
  },
  {
    value: 'Не начато',
    label: 'Не начато',
    icon: Scan,
  },
];