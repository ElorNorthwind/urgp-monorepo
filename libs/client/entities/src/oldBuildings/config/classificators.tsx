import { cn } from '@urgp/client/shared';
import {
  Blocks,
  Bot,
  BotOff,
  BrickWall,
  BrickWallFire,
  Building2,
  CalendarCheck,
  CalendarRange,
  CalendarX,
  CheckCheck,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  // CircleDollarSign,
  CircleEllipsis,
  CircleMinus,
  CircleX,
  Construction,
  Container,
  Eye,
  EyeOff,
  Frown,
  Gavel,
  HardHat,
  House,
  MailX,
  RefreshCcw,
  RotateCcw,
  Scale,
  Scan,
  ScanEye,
} from 'lucide-react';

export const relocationTypes = [
  {
    value: 1,
    label: 'Полное переселение',
    icon: House,
    className: cn('text-sky-500'),
    gradientClass: cn('bg-gradient-to-bl from-white to-sky-100'),
  },
  {
    value: 2,
    label: 'Частичное отселение',
    icon: Blocks,
    className: cn('text-amber-500'),
  },
  {
    value: 3,
    label: 'Многоэтапное отселение',
    icon: Building2,
    className: cn('text-fuchsia-500'),
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
    className: cn('text-lime-500'),
  },
  {
    value: 'От 1 до 2 месяцев',
    label: 'От 1 до 2 месяцев',
    icon: CalendarRange,
    className: cn('text-yellow-400'),
  },
  {
    value: 'От 2 до 5 месяцев',
    label: 'От 2 до 5 месяцев',
    icon: CalendarRange,
    className: cn('text-amber-500'),
  },
  {
    value: 'От 5 до 8 месяцев',
    label: 'От 5 до 8 месяцев',
    icon: CalendarRange,
    className: cn('text-orange-500'),
  },
  {
    value: 'Более 8 месяцев',
    label: 'Более 8 месяцев',
    icon: CalendarRange,
    className: cn('text-rose-600'),
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

export const relocationDeviations = [
  {
    value: 'Работа завершена',
    label: 'Работа завершена',
    icon: CircleCheck,
    className: 'text-emerald-500',
  },
  // {
  //   value: 'В работе у МФР',
  //   label: 'В работе у МФР',
  //   icon: CircleDollarSign,
  //   className: 'text-violet-500',
  // },
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
    value: 'Наступили риски',
    label: 'Наступили риски',
    icon: CircleX,
    className: 'text-red-500',
  },
];

export const MFRInvolvmentTypes = [
  { value: 'С МФР', label: 'С МФР', icon: Bot },
  { value: 'Без МФР', label: 'Без МФР', icon: BotOff },
];

export const renovationBossControllStatus = [
  {
    value: 'Контроль не ставился',
    label: 'Контроль не ставился',
    icon: EyeOff,
    className: 'text-stone-500',
  },
  {
    value: 'Срок контроля не наступил',
    label: 'Срок контроля не наступил',
    icon: Eye,
    className: 'text-blue-500',
  },
  {
    value: 'Срок контроля наступил',
    label: 'Срок контроля наступил',
    icon: ScanEye,
    className: 'text-rose-500',
  },
];

export const renovationDefectStatus = [
  {
    value: 'Дефектов не выявлено',
    label: 'Дефектов не выявлено',
    icon: Container,
    className: 'text-gray-500',
  },
  {
    value: 'Дефекты устранены',
    label: 'Дефекты устранены',
    icon: HardHat,
    className: 'text-emerald-500',
  },
  {
    value: 'Дефекты не устранены',
    label: 'Дефекты не устранены',
    icon: BrickWallFire,
    className: 'text-rose-500',
  },
];

export const renovationProblems = [
  {
    value: 'МФР',
    label: 'МФР',
    icon: CircleDollarSign,
    className: 'text-violet-500',
  },
  {
    value: 'Проблемная',
    label: 'Проблемная',
    icon: HardHat,
    className: 'text-blue-500',
  },
  {
    value: 'Долгие суды',
    label: 'Долгие суды',
    icon: Scale,
    className: 'text-rose-500',
  },
  {
    value: 'Суды',
    label: 'Суды',
    icon: Scale,
    className: 'text-orange-500',
  },
  {
    value: 'Просрочен иск',
    label: 'Просрочен иск',
    icon: CalendarX,
    className: 'text-red-500',
  },
  {
    value: 'Иск граждан',
    label: 'Иск граждан',
    icon: Gavel,
    className: 'text-fuschia-500',
  },
  {
    value: 'Нет ЗУ',
    label: 'Нет ЗУ',
    icon: MailX,
    className: 'text-amber-500',
  },
  {
    value: 'Неустраненные дефекты',
    label: 'Неустраненные дефекты',
    icon: BrickWallFire,
    className: 'text-rose-500',
  },
  {
    value: 'Устраненные дефекты',
    label: 'Устраненные дефекты',
    icon: BrickWallFire,
    className: 'text-stone-500',
  },
  {
    value: 'Отказ',
    label: 'Отказ',
    icon: Frown,
    className: 'text-lime-500',
  },
  {
    value: 'Без трудностей',
    label: 'Без трудностей',
    icon: CircleMinus,
    className: 'text-gray-500',
  },
];

//  CASE WHEN d.is_mfr = true THEN 'МФР' ELSE null END,
//           CASE WHEN LOWER(d.old_apart_status) LIKE ANY (ARRAY['%аренда%', '%федеральная%', '%служебн%', '%общежит%']) THEN 'Проблемная' ELSE null END,
//           CASE WHEN CURRENT_TIMESTAMP::date - d.litigation_start_date::date > 90 THEN 'Долгие суды' WHEN d.litigation_start_date IS NOT NULL THEN 'Суды' ELSE null END,
//           CASE WHEN CURRENT_TIMESTAMP::date - d.contract_notification_date::date > 30 THEN 'Просрочен иск' ELSE null END,
//           CASE WHEN s.id = 9 THEN 'Нет ЗУ' ELSE NULL END,
//           CASE WHEN d.litigation_people_claim = true THEN 'Иск граждан' ELSE null END,
//           CASE WHEN d.has_active_defects = true THEN 'Неустраненные дефекты' WHEN d.has_defects = true THEN 'Устраненные дефекты' ELSE null END,
//           CASE WHEN d.reject_date IS NOT NULL THEN 'Отказ' ELSE null END
