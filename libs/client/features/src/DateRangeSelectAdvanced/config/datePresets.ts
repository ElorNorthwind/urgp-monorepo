import {
  endOfDay,
  endOfToday,
  endOfWeek,
  endOfYesterday,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfToday,
  startOfWeek,
  StartOfWeekOptions,
  startOfYear,
  startOfYesterday,
  subDays,
  subWeeks,
} from 'date-fns';

export type DatePreset = {
  name: string;
  label: string;
  from: Date;
  to: Date;
};

const weekOptions: StartOfWeekOptions = { weekStartsOn: 1 };

export const PRESETS: DatePreset[] = [
  {
    name: 'today',
    label: 'Сегодня',
    from: startOfToday(),
    to: endOfToday(),
  },
  {
    name: 'yesterday',
    label: 'Вчера',
    from: startOfYesterday(),
    to: endOfYesterday(),
  },
  {
    name: 'last30',
    label: 'Последние 30 дней',
    from: subDays(startOfToday(), 30),
    to: endOfToday(),
  },
  {
    name: 'thisWeek',
    label: 'Эта неделя',
    from: startOfWeek(new Date(), weekOptions),
    to: endOfToday(),
  },
  {
    name: 'lastWeek',
    label: 'Прошлая неделя',
    from: startOfWeek(subWeeks(new Date(), 1), weekOptions),
    to: endOfWeek(subWeeks(new Date(), 1), weekOptions),
  },
  {
    name: 'thisMonth',
    label: 'Этот месяц',
    from: startOfMonth(new Date()),
    to: endOfToday(),
  },
  {
    name: 'thisQuarter',
    label: 'Этот квартал',
    from: startOfQuarter(new Date()),
    to: endOfToday(),
  },
  {
    name: 'thisYear',
    label: 'Этот год',
    from: startOfYear(new Date()),
    to: endOfToday(),
  },
];

export const DEFAULT_PRESET = PRESETS[2];

export const DEFAULT_PRESET_RANGE = {
  from: DEFAULT_PRESET.from,
  to: DEFAULT_PRESET.to,
};
