import { BriefcaseBusiness, CircuitBoard, LayoutDashboard } from 'lucide-react';

// Menu items.
export const items = [
  {
    title: 'Дашборд',
    url: '/control',
    icon: LayoutDashboard,
  },
  {
    title: 'Дела',
    url: '/control/cases',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Системные проблемы',
    url: '/control/problems',
    icon: CircuitBoard,
  },
  // {
  //   title: 'Требует решения',
  //   url: '/control',
  //   icon: Search,
  // },
];
