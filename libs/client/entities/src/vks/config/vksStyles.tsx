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
  // 3	"Управление правового обеспечения в жилищной сфере"	"УПОЖС"	"Спесивцева"
  // 4	"Управление оформления вторичных имущественно-земельных отношений"	"УОВИЗО"	"Смирнова"
  // 5	"Управление по реализации градостроительной политики и транспортной инфраструктуры"	"УРГПТИ"	"Лапковская"
  // 6	"Управление приватизации городского имущества"	"УПГИ"	"Файнгерш"
  // 7	"Управление по формированию земельных участков"	"УФЗУ"	"Воронков"
  // 8	"Управления обеспечения кадастрового учета и регистрации прав"	"УОКУРП"	"Стифеева"
  // 9	"Управления оформления имущественных и земельно-правовых отношений"	"УОИЗПО"	"Мартьянов"
  // 10	"Управление экономики"	"УЭ"	"Мишин"
  // 11	"Управление городским имуществом в Cеверо-Восточном административном округе"	"УГИ СВАО"	"Ильина"
  // 12	"Управление городским имуществом в Юго-Западном административном округе"	"УГИ ЮЗАО"	"Заикина"
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
