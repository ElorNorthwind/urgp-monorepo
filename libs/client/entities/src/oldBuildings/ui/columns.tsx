import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { HStack, Progress, VStack } from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import {
  CircleAlert,
  CircleCheck,
  CircleEllipsis,
  CircleX,
} from 'lucide-react';

const columnHelper = createColumnHelper<OldBuilding>();

export const oldBuildingsColumns = [
  columnHelper.accessor('district', {
    header: 'Район',
    cell: (props) => {
      return (
        <VStack gap={'none'} justify={'center'} align={'start'} className="">
          <div className="whitespace-nowrap ">{props.row.original.okrug}</div>
          <div className="text-muted-foreground whitespace-nowrap text-sm">
            {props.getValue()}
          </div>
        </VStack>
      );
    },
  }),
  columnHelper.accessor('adress', {
    header: 'Адрес',
  }),
  columnHelper.accessor('relocationType', {
    header: 'Тип переселения',
    cell: (props) => {
      return (
        <VStack gap={'none'} justify={'center'} align={'start'} className="">
          <div className="whitespace-nowrap text-xs">{props.getValue()}</div>
          <div className="text-muted-foreground whitespace-nowrap text-xs">
            {props.row.original.buildingRelocationStartAge}
          </div>
        </VStack>
      );
    },
  }),

  columnHelper.accessor('buildingDeviation', {
    header: 'Статус',
    size: 500,
    maxSize: 500,
    cell: (props) => {
      const icon = {
        'Без отклонений': (
          <CircleEllipsis className="mr-2 h-6 w-6 text-blue-500" />
        ),
        Завершено: <CircleCheck className="mr-2 h-6 w-6 text-emerald-500" />,
        'Требует внимания': (
          <CircleAlert className="mr-2 h-6 w-6 text-yellow-500" />
        ),
        'Есть риски': <CircleX className="mr-2 h-6 w-6 text-red-500" />,
      }[props.getValue()];

      return (
        <HStack
          gap="s"
          align={'center'}
          justify={'start'}
          className="w-max flex-nowrap "
        >
          {icon && icon}
          <VStack gap="none" align={'start'}>
            <div className="whitespace-nowrap  text-xs">{props.getValue()}</div>
            <div className="whitespace-nowrap  text-xs">
              {props.row.original.buildingRelocationStatus}
            </div>
          </VStack>
        </HStack>
      );
    },
  }),
  columnHelper.accessor('terms.actual.firstResetlementStart', {
    header: 'Сроки',
    cell: ({ cell }) => {
      const date = cell.getValue();
      return <span>{date && new Date(date).toLocaleDateString('ru-RU')}</span>;
    },
  }),
  columnHelper.accessor((row) => row.totalApartments.toString(), {
    header: 'Всего кв.',
    cell: (info) => {
      return info.row.original.totalApartments > 0 ? (
        <span>{info.getValue()}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  }),
  columnHelper.accessor((row) => row.appartments.status.contract.toString(), {
    header: 'Прогресс',
    cell: (props) => {
      const donePercent = Math.round(
        (props.row.original.appartments.status.contract /
          (props.row.original.appartments.total -
            props.row.original.appartments.status.empty)) *
          100,
      );
      return (
        <HStack
          gap="s"
          align={'center'}
          justify={'start'}
          className="w-[200px] flex-nowrap text-right"
        >
          <div className="w-[40px]">
            {donePercent > 0 ? donePercent + '%' : '-'}
          </div>
          <div className="w-[150px] ">
            <Progress value={donePercent} className="h-4 border" />
          </div>
        </HStack>
      );
    },
  }),
];
