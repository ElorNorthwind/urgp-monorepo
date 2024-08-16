import { createColumnHelper } from '@tanstack/react-table';
import { UnansweredMessage } from '@urgp/shared/entities';
import { ApartmentCell } from './cells/ApartmentCell';
import { MessageCell } from './cells/MessageCell';
import { AdressCell } from './cells/AdressCell';

const columnHelper = createColumnHelper<UnansweredMessage>();

export const unansweredMessagesColumns = [
  columnHelper.accessor('adress', {
    id: 'adress',
    header: 'Адрес',
    size: 150,
    enableSorting: false,
    cell: (props) => {
      return <AdressCell {...props} />;
    },
  }),

  columnHelper.accessor('apartNum', {
    id: 'apartNum',
    header: 'Квартира',
    size: 200,
    enableSorting: false,
    cell: (props) => {
      return <ApartmentCell {...props} />;
    },
  }),

  columnHelper.accessor('messageContent', {
    id: 'messageContent',
    header: 'Сообщение',
    size: 300,
    enableSorting: false,
    cell: (props) => {
      return <MessageCell {...props} />;
    },
  }),

  //   columnHelper.accessor('district', {
  //     id: 'district',
  //     header: 'Район',
  //     size: 150,
  //     cell: (props) => {
  //       return <AreaCell {...props} />;
  //     },
  //   }),

  //   columnHelper.accessor('adress', {
  //     id: 'adress',
  //     header: 'Адрес',
  //     size: 240,
  //     // cell: (props) => {
  //     //   return <AdressCell {...props} />;
  //     // },
  //   }),

  //   columnHelper.accessor('buildingRelocationStartAge', {
  //     id: 'age',
  //     header: 'Тип и срок',
  //     size: 215,
  //     cell: (props) => {
  //       return <RelocationTypeCell {...props} />;
  //     },
  //   }),

  //   columnHelper.accessor('buildingRelocationStatus', {
  //     id: 'status',
  //     header: 'Статус',
  //     size: 180,
  //     cell: (props) => {
  //       return <RelocationStatusCell {...props} />;
  //     },
  //     // enableSorting: false,
  //   }),

  //   columnHelper.accessor(
  //     (row) => (row.terms.actual.firstResetlementStart || '-').toString(),
  //     {
  //       // terms.actual.firstResetlementStart'
  //       id: 'date',
  //       header: 'Старт',
  //       size: 90,

  //       cell: (props) => {
  //         return <TermsCell {...props} />;
  //       },
  //       meta: {
  //         headerClass: 'justify-center',
  //         cellClass: 'justify-center text-center',
  //       },
  //     },
  //   ),

  //   columnHelper.accessor((row) => row.totalApartments.toString(), {
  //     id: 'total',
  //     header: 'Квартир',
  //     sortDescFirst: true,
  //     size: 80,
  //     cell: (props) => {
  //       return <ApartmentsCell {...props} />;
  //     },
  //     meta: {
  //       headerClass: 'justify-center',
  //       cellClass: 'justify-center text-center',
  //     },
  //     enableSorting: true,
  //   }),

  //   columnHelper.accessor((row) => row.apartments.deviation.done.toString(), {
  //     id: 'risk',
  //     header: 'Ход работы',
  //     size: 220,
  //     sortDescFirst: true,
  //     cell: (props) => {
  //       return <DeviationsCell {...props} />;
  //     },
  //     meta: {
  //       headerClass: 'justify-center',
  //     },
  //   }),
];
