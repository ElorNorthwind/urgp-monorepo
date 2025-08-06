import { createColumnHelper } from '@tanstack/react-table';
import { VksCase } from '@urgp/shared/entities';
import { VksCaseClientCell } from './cells/VksCaseClientCell';
import { VksCaseConsultantCell } from './cells/VksCaseConsultantCell';
import { VksCaseDateCell } from './cells/VksCaseDateCell';
import { VksCaseStatusCell } from './cells/VksCaseStatusCell';
import { VksCaseGradeCell } from './cells/VksCaseGradeCell';
import { VksCaseServiceCell } from './cells/VksCaseServiceCell';

const columnHelper = createColumnHelper<VksCase>();

export const vksCasesColumns = [
  columnHelper.accessor(
    (row) => {
      return (
        new Date(Date.parse(row?.date)).setHours(
          parseInt(row?.time?.slice(0, 2)),
          parseInt(row?.time?.slice(3, 5)),
        ) || 0
      );
    },
    {
      id: 'date',
      header: 'Дата',
      size: 45,
      // enableHiding: true,
      enableSorting: true,
      sortDescFirst: true,
      cell: (props) => {
        return <VksCaseDateCell {...props} />;
      },
    },
  ),

  columnHelper.accessor(
    (row) => {
      return row?.status || 'не указано';
    },
    {
      id: 'status',
      header: 'Статус',
      size: 80,
      enableHiding: true,
      enableSorting: true,
      sortDescFirst: true,
      cell: (props) => {
        return <VksCaseStatusCell {...props} />;
      },
    },
  ),

  columnHelper.accessor(
    (row) => {
      return row?.clientFio || 'ФИО не указано';
    },
    {
      id: 'client',
      header: 'Заявитель',
      size: 80,
      enableHiding: true,
      enableSorting: true,
      sortDescFirst: true,
      cell: (props) => {
        return <VksCaseClientCell {...props} />;
      },
    },
  ),

  columnHelper.accessor(
    (row) => {
      return row?.operatorFio || 'Анкета не заполнена';
    },
    {
      id: 'operator',
      header: 'Консультант',
      size: 60,
      enableHiding: true,
      enableSorting: true,
      sortDescFirst: true,
      cell: (props) => {
        return <VksCaseConsultantCell {...props} />;
      },
    },
  ),

  columnHelper.accessor(
    (row) => {
      return row?.grade || 0;
    },
    {
      id: 'grade',
      header: 'Оценка',
      size: 60,
      enableHiding: true,
      enableSorting: true,
      sortDescFirst: true,
      cell: (props) => {
        return <VksCaseGradeCell {...props} />;
      },
    },
  ),

  columnHelper.accessor(
    (row) => {
      return row?.serviceName || '';
    },
    {
      id: 'service',
      header: 'Сервис',
      size: 80,
      enableHiding: true,
      enableSorting: true,
      sortDescFirst: true,
      cell: (props) => {
        return <VksCaseServiceCell {...props} />;
      },
    },
  ),
];
