import { cn } from '@urgp/client/shared';
import {
  EquityObjectDocuments,
  EquityObjectProblems,
} from '@urgp/shared/entities';
import {
  Badge,
  BadgeAlert,
  BadgeInfo,
  BadgePercent,
  BadgePlus,
  BadgeQuestionMark,
  BadgeRussianRuble,
  BadgeX,
  Blocks,
  Building,
  Building2,
  Car,
  Circle,
  CircleCheck,
  CircleEllipsis,
  CirclePlay,
  CircleUser,
  CircleUserRound,
  Construction,
  DoorOpen,
  FileCheck,
  FileMinus,
  FileX,
  Grid2X2Check,
  HandCoins,
  House,
  KeySquare,
  LucideProps,
  MessageSquareQuote,
  Package,
  Phone,
  PhoneCall,
  ShieldCheck,
  ShieldEllipsis,
  Square,
  SquareAsterisk,
  SquareCheck,
  SquareCheckBig,
  SquareDashedBottom,
  SquareDashedBottomCode,
  SquareDot,
  SquarePen,
  SquarePi,
  SquaresExclude,
  SquaresIntersect,
  SquareUserRound,
  StickyNote,
} from 'lucide-react';
import { StyleData } from '../../cases';

const mosotdelStyle = {
  icon: Building,
  // iconStyle: cn('bg-blue-500 rounded-full text-blue-500'),
  iconStyle: cn('text-blue-500'),
  badgeStyle: cn(
    'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-blue-500',
    "before:content-[''] before:rounded-full before:size-3 before:bg-blue-500 before:mr-1",
  ),
};

const mosotdelConstructionStyle = {
  icon: Construction,
  // iconStyle: cn('bg-blue-500 rounded-full text-blue-500'),
  iconStyle: cn('text-gray-500'),
  badgeStyle: cn(
    'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-blue-500',
    "before:content-[''] before:rounded-full before:size-3 before:bg-blue-500 before:mr-1",
  ),
};

const foundationStyle = {
  icon: Building,
  // iconStyle: cn('bg-rose-500 rounded-full text-rose-500'),
  iconStyle: cn('text-emerald-500'),
  badgeStyle: cn(
    'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-emerald-500',
    "before:content-[''] before:rounded-full before:size-3 before:bg-emerald-500 before:mr-1",
  ),
};

const foundationConstractionStyle = {
  icon: Construction,
  // iconStyle: cn('bg-rose-500 rounded-full text-rose-500'),
  iconStyle: cn('text-gray-500'),
  badgeStyle: cn(
    'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-emerald-500',
    "before:content-[''] before:rounded-full before:size-3 before:bg-emerald-500 before:mr-1",
  ),
};

export const equityBuildingStyles = {
  fond_done: foundationStyle,
  fond_construction: foundationConstractionStyle,
  ao_done: mosotdelStyle,
  ao_construction: mosotdelConstructionStyle,
} as Record<string, StyleData>;

export const equityObjectStatusStyles = {
  1: {
    icon: CircleEllipsis,
    iconStyle: cn('text-stone-500'),
    chartColor: '#cbd5e1',
  },
  7: {
    icon: CirclePlay,
    iconStyle: cn('text-yellow-500'),
    chartColor: '#cbd5e1',
  },
  2: {
    icon: CircleCheck,
    iconStyle: cn('text-orange-500'),
    chartColor: '#f97316',
  },
  3: {
    icon: CircleUserRound,
    iconStyle: cn('text-emerald-500'),
    chartColor: '#10b981',
  },
  4: {
    icon: ShieldEllipsis,
    iconStyle: cn('text-gray-500'),
    chartColor: '#cbd5e1',
  },
  5: {
    icon: ShieldCheck,
    iconStyle: cn('text-blue-500'),
    chartColor: '#3b82f6',
  },
} as Record<number, StyleData>;

export const equityClaimItemTypeStyles = {
  1: { icon: DoorOpen, iconStyle: cn('text-teal-500') },
  2: { icon: Car, iconStyle: cn('text-indigo-500') },
  3: { icon: HandCoins, iconStyle: cn('text-amber-500') },
} as Record<number, StyleData>;

export const equityObjectTypeStyles = {
  1: { icon: DoorOpen, iconStyle: cn('text-teal-500'), label: 'кв.' },
  2: { icon: Car, iconStyle: cn('text-indigo-500'), label: 'мм.' },
  3: { icon: Package, iconStyle: cn('text-stone-500'), label: 'пом.' },
} as Record<number, StyleData>;

export const equityProblemsStyles = {
  [EquityObjectProblems.unidentified]: {
    icon: BadgeQuestionMark,
    iconStyle: cn('text-amber-500'),
    label: 'Не опознано',
    fullLabel: 'Требование не удалось соотнести с реальным объектом',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-amber-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-amber-500 before:mr-1 before:flex-shrink-0",
    ),
  },
  [EquityObjectProblems.idproblem]: {
    icon: BadgePercent,
    iconStyle: cn('text-indigo-500'),
    label: 'Сомнение в адресе',
    fullLabel: 'Требование из РТУС соотнесено с объектом условно',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-indigo-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-indigo-500 before:mr-1 before:flex-shrink-0",
    ),
  },
  [EquityObjectProblems.potentialclaim]: {
    icon: BadgePlus,
    iconStyle: cn('text-lime-500'),
    label: 'Потенциальное треб.',
    fullLabel: 'В корпусе есть неопределенное требование на данный тип объекта',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-lime-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-lime-500 before:mr-1 before:flex-shrink-0",
    ),
  },

  [EquityObjectProblems.defects]: {
    icon: BadgeAlert,
    iconStyle: cn('text-fuchsia-500'),
    label: 'Дефекты',
    fullLabel: 'В ходе работы с объектом выявлены дефекты',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-fuchsia-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-fuchsia-500 before:mr-1 before:flex-shrink-0",
    ),
  },
  [EquityObjectProblems.doublesell]: {
    icon: BadgeX,
    iconStyle: cn('text-red-500'),
    label: 'Двойная продажа',
    fullLabel: 'Выявлены признаки конкурирубщих требований',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-red-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-red-500 before:mr-1 before:flex-shrink-0",
    ),
  },
  [EquityObjectProblems.unpaid]: {
    icon: BadgeRussianRuble,
    iconStyle: cn('text-teal-500'),
    label: 'Недоплата',
    fullLabel: 'Сумма по требования оплачена не полностью',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-teal-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-teal-500 before:mr-1 before:flex-shrink-0",
    ),
  },
  none: {
    icon: Badge,
    iconStyle: cn('text-slate-500'),
    label: 'Нет выявленых проблем',
    fullLabel: 'Проблем в работе не выявлено',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-slate-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-slate-500 before:mr-1 before:flex-shrink-0",
    ),
  },
} as Record<string, StyleData>;

export const equityDocumentsStyles = {
  [EquityObjectDocuments.ok]: {
    icon: FileCheck,
    iconStyle: cn('text-emerald-500'),
    label: 'Полный пакет',
    fullLabel: 'Заявитель представил все требуемые документы',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-green-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-green-500 before:mr-1 before:flex-shrink-0",
    ),
  },
  [EquityObjectDocuments.problem]: {
    icon: FileMinus,
    iconStyle: cn('text-amber-500'),
    label: 'Неполный пакет',
    fullLabel: 'Заявитель представил документы, но к ним есть замечания',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-amber-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-amber-500 before:mr-1 before:flex-shrink-0",
    ),
  },
  [EquityObjectDocuments.none]: {
    icon: FileX,
    iconStyle: cn('text-gray-500'),
    label: 'Нет пакета',
    fullLabel: 'Заявитель не представил документы',
    badgeStyle: cn(
      'bg-background border p-1 px-2 hover:bg-muted-foreground/5 border-gray-500',
      "before:content-[''] before:rounded-full before:size-3 before:bg-gray-500 before:mr-1 before:flex-shrink-0",
    ),
  },
} as Record<string, StyleData>;

export const equityOperationTypeStyles = {
  0: { icon: Square, iconStyle: cn('text-slate-500') }, // Фолбэк

  1: { icon: SquareCheck, iconStyle: cn('text-teal-500') }, // Акт Подписан
  16: { icon: KeySquare, iconStyle: cn('text-teal-500') }, // Выданы ключи

  2: { icon: SquareDashedBottom, iconStyle: cn('text-orange-500') }, // Дефектная ведомость открыта
  3: { icon: SquareDashedBottomCode, iconStyle: cn('text-cyan-500') }, // Дефектная ведомость закрыта
  4: { icon: SquarePi, iconStyle: cn('text-amber-500') }, // Дефекты выявлены

  20: { icon: StickyNote, iconStyle: cn('text-stone-500') }, // Сданы документы
  5: { icon: SquareUserRound, iconStyle: cn('text-indigo-500') }, // Запись на прием - подача документов
  12: { icon: Phone, iconStyle: cn('text-sky-500') }, // Запись на прием - консультация
  13: { icon: PhoneCall, iconStyle: cn('text-green-500') }, // Консультация оказана

  6: { icon: SquareAsterisk, iconStyle: cn('text-yellow-500') }, // Заключение запрошено - подписать акт
  11: { icon: SquareDot, iconStyle: cn('text-yellow-500') }, // Заключение запрошено - выдать ключи
  7: { icon: SquarePen, iconStyle: cn('text-blue-500') }, // Заключение УРЖП дано
  14: { icon: SquarePen, iconStyle: cn('text-violet-500') }, // Заключение УПОЖС
  15: { icon: SquarePen, iconStyle: cn('text-emerald-500') }, // Заключение УОРК
  19: { icon: SquarePen, iconStyle: cn('text-lime-500') }, // Заключение УПОЗИ

  8: { icon: SquaresIntersect, iconStyle: cn('text-red-500') }, // Выявлены признаки двойной продажи
  18: { icon: SquaresExclude, iconStyle: cn('text-lime-500') }, // Двойная снята

  9: { icon: Blocks, iconStyle: cn('text-rose-500') }, // Выявлены проблемы идентификации
  10: { icon: Grid2X2Check, iconStyle: cn('text-green-500') }, // Проблемы идентификации сняты

  17: { icon: MessageSquareQuote, iconStyle: cn('text-stone-500') }, // Примечание
} as Record<number, StyleData>;
