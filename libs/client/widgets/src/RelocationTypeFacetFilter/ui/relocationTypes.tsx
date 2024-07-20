import { Blocks, Building2, House } from 'lucide-react';

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
