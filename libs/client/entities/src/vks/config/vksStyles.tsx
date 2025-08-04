import { cn } from '@urgp/client/shared';
import {
  BriefcaseBusiness,
  Calendar1,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleEllipsis,
  CircleSlash,
  CircleX,
  House,
  LaptopMinimalCheck,
  MapPinHouse,
  MessageCircleQuestionMark,
  Server,
  SquareCode,
  SquareMenu,
  SquareX,
  User,
  UserLock,
} from 'lucide-react';

const badgeStyle = cn(
  "bg-background border p-1 px-2 hover:bg-muted-foreground/5 before:content-[''] before:rounded-full before:size-3 before:mr-1",
);

export const departmentStyles = {
  0: {
    icon: Circle,
    iconStyle: cn('bg-gray-500 rounded-full text-gray-500'),
    badgeStyle: cn(badgeStyle, 'border-gray-500 before:bg-gray-500'),
  },
  // 1	"Управление реализации жилищных программ"	"УРЖП"	"Лукьянов"
  1: {
    icon: Circle,
    iconStyle: cn('bg-blue-500 rounded-full text-blue-500'),
    badgeStyle: cn(badgeStyle, 'border-blue-500 before:bg-blue-500'),
  },
  // 2	"Управления оформления жилищных правоотношений"	"УОЖП"	"Пахмутов"
  2: {
    icon: Circle,
    iconStyle: cn('bg-cyan-500 rounded-full text-cyan-500'),
    badgeStyle: cn(badgeStyle, 'border-cyan-500 before:bg-cyan-500'),
  },
  // 3	"Управление правового обеспечения в жилищной сфере"	"УПОЖС"	"Спесивцева"
  3: {
    icon: Circle,
    iconStyle: cn('bg-blue-500 rounded-full text-blue-500'),
    badgeStyle: cn(badgeStyle, 'border-blue-500 before:bg-blue-500'),
  },
  // 4	"Управление оформления вторичных имущественно-земельных отношений"	"УОВИЗО"	"Смирнова"
  4: {
    icon: Circle,
    iconStyle: cn('bg-emerald-500 rounded-full text-emerald-500'),
    badgeStyle: cn(badgeStyle, 'border-emerald-500 before:bg-emerald-500'),
  },
  // 5	"Управление по реализации градостроительной политики и транспортной инфраструктуры"	"УРГПТИ"	"Лапковская"
  5: {
    icon: Circle,
    iconStyle: cn('bg-blue-500 rounded-full text-blue-500'),
    badgeStyle: cn(badgeStyle, 'border-blue-500 before:bg-blue-500'),
  },
  // 6	"Управление приватизации городского имущества"	"УПГИ"	"Файнгерш"
  6: {
    icon: Circle,
    iconStyle: cn('bg-lime-500 rounded-full text-lime-500'),
    badgeStyle: cn(badgeStyle, 'border-lime-500 before:bg-lime-500'),
  },
  // 7	"Управление по формированию земельных участков"	"УФЗУ"	"Воронков"
  7: {
    icon: Circle,
    iconStyle: cn('bg-amber-500 rounded-full text-amber-500'),
    badgeStyle: cn(badgeStyle, 'border-amber-500 before:bg-amber-500'),
  },
  // 8	"Управления обеспечения кадастрового учета и регистрации прав"	"УОКУРП"	"Стифеева"
  8: {
    icon: Circle,
    iconStyle: cn('bg-pink-500 rounded-full text-pink-500'),
    badgeStyle: cn(badgeStyle, 'border-pink-500 before:bg-pink-500'),
  },
  // 9	"Управления оформления имущественных и земельно-правовых отношений"	"УОИЗПО"	"Мартьянов"
  9: {
    icon: Circle,
    iconStyle: cn('bg-violet-500 rounded-full text-violet-500'),
    badgeStyle: cn(badgeStyle, 'border-violet-500 before:bg-violet-500'),
  },
  // 10	"Управление экономики"	"УЭ"	"Мишин"
  10: {
    icon: Circle,
    iconStyle: cn('bg-indigo-500 rounded-full text-indigo-500'),
    badgeStyle: cn(badgeStyle, 'border-indigo-500 before:bg-indigo-500'),
  },
  // 11	"Управление городским имуществом в Cеверо-Восточном административном округе"	"УГИ СВАО"	"Ильина"
  11: {
    icon: Circle,
    iconStyle: cn('bg-teal-500 rounded-full text-teal-500'),
    badgeStyle: cn(badgeStyle, 'border-teal-500 before:bg-teal-500'),
  },
  // 12	"Управление городским имуществом в Юго-Западном административном округе"	"УГИ ЮЗАО"	"Заикина"
  12: {
    icon: Circle,
    iconStyle: cn('bg-green-500 rounded-full text-green-500'),
    badgeStyle: cn(badgeStyle, 'border-green-500 before:bg-green-500'),
  },
};

export const clientTypeStyles = {
  'Юридическое лицо': {
    icon: BriefcaseBusiness,
    iconStyle: cn('text-purple-500'),
  },
  'Индивидуальный предприниматель': {
    icon: UserLock,
    iconStyle: cn('text-sky-500'),
  },
  'Физическое лицо': {
    icon: User,
    iconStyle: cn('text-emerald-500'),
  },
};

export const propertyTypeStyles = {
  'Земельные и нежилые имущественные вопросы': {
    icon: MapPinHouse,
    iconStyle: cn('text-amber-500'),
  },
  'Жилищные вопросы': {
    icon: House,
    iconStyle: cn('text-teal-500'),
  },
};

export const vksCaseStatusStyles = {
  обслужен: {
    icon: CircleCheck,
    iconStyle: cn('text-green-500'),
  },
  'отменено ОИВ': {
    icon: CircleSlash,
    iconStyle: cn('text-rose-500'),
  },
  'талон не был взят': {
    icon: CircleDashed,
    iconStyle: cn('text-orange-500'),
  },
  'отменено пользователем': {
    icon: CircleX,
    iconStyle: cn('text-stone-500'),
  },
  'не явился по вызову': {
    icon: CircleEllipsis,
    iconStyle: cn('text-blue-500'),
  },
};

export const bookingSourceStyles = {
  Иной: {
    icon: MessageCircleQuestionMark,
    iconStyle: cn('text-muted-foreground/50'),
  },
  Онлайн: {
    icon: LaptopMinimalCheck,
    iconStyle: cn('text-foreground'),
  },
  Календарь: {
    icon: Calendar1,
    iconStyle: cn('text-foreground'),
  },
  'Портал ГУ': {
    icon: Server,
    iconStyle: cn('text-foreground'),
  },
};

export const gradeSourceStyles = {
  none: {
    icon: SquareX,
    iconStyle: cn('text-muted-foreground/50'),
  },
  online: {
    icon: SquareCode,
    iconStyle: cn('text-foreground'),
  },
  survey: {
    icon: SquareMenu,
    iconStyle: cn('text-foreground'),
  },
};
