import { AddressSessionStatuses } from '@urgp/shared/entities';
import { StyleData } from '../../cases';
import {
  CircleAlert,
  CircleCheck,
  CircleEllipsis,
  CirclePlay,
} from 'lucide-react';

export const sessionStatusStyles = {
  [AddressSessionStatuses.pending]: {
    label: 'В очереди',
    icon: CircleEllipsis,
    iconStyle: 'text-gray-500',
  },
  [AddressSessionStatuses.running]: {
    label: 'Выполняется',
    icon: CirclePlay,
    iconStyle: 'text-sky-500',
  },
  [AddressSessionStatuses.error]: {
    label: 'Ошибка',
    icon: CircleAlert,
    iconStyle: 'text-rose-500',
  },
  [AddressSessionStatuses.done]: {
    label: 'Завершено',
    icon: CircleCheck,
    iconStyle: 'text-emerald-500',
  },
} as Record<AddressSessionStatuses, StyleData>;
