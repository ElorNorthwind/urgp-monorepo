import {
  BriefcaseBusiness,
  CircuitBoard,
  LayoutDashboard,
  Scale,
} from 'lucide-react';

// Menu items.
export const items = [
  {
    title: 'Дашборд',
    url: '/control',
    icon: LayoutDashboard,
  },
  {
    title: 'Все дела',
    url: '/control/cases',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Системные проблемы',
    url: '/control/problems',
    icon: CircuitBoard,
  },
  {
    title: 'Ожидают моего решения',
    url: '/control/pending',
    icon: Scale,
  },
];

export const userMenuItems = [];
