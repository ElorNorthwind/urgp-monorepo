import { endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import { Headset, LayoutDashboard, Table2 } from 'lucide-react';

// Menu items.
export const items = [
  {
    title: 'Дашборд',
    url: '/vks',
    icon: LayoutDashboard,
  },
  {
    title: 'Список консультаций',
    url: '/vks/cases',
    icon: Headset,
  },
  {
    title: 'Отчёт управления',
    url: '/vks/report',
    icon: Table2,
    departmentLocked: true,
    search: {
      dateFrom: format(
        startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
        'yyyy-MM-dd',
      ),
      dateTo: format(
        endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
        'yyyy-MM-dd',
      ),
    },
  },
];

export const userMenuItems = [];
