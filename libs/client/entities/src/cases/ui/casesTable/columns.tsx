import { createColumnHelper } from '@tanstack/react-table';
import { CaseWithStatus } from '@urgp/shared/entities';
import { ApplicantCell } from './cells/ApplicantCell';
import { DirectionCell } from './cells/DirectionCell';
import { Checkbox } from '@urgp/client/shared';
import { CaseTypeCell } from './cells/CaseTypeCell';
import { ExternalCasesCell } from './cells/ExternalCasesCell';
import { CaseStatusCell } from './cells/CaseStatusCell';
import { CaseDesctiptionCell } from './cells/CaseDescriptionCell';

const columnHelper = createColumnHelper<CaseWithStatus>();

// type CasePayload = {
//     externalCases: ExternalCase[]; // связанные номера
//     type: TypeInfo; // тип дела
//     directions: TypeInfo[]; // направления работы
//     problems: TypeInfo[]; // системные проблемы
//     description: string; // собственно описание проблемы
//     fio: string;
//     adress: string | null;
//   } & BasicPayloadData;

//   export type Case = {
//     id: number;
//     createdAt: Date;
//     authorId: number;
//     payload: CasePayload; // возвращаем только последний пейлоуд, а вообще тут массив
//   };

export const controlCasesColumns = [
  columnHelper.display({
    id: 'select',
    size: 40,
    header: ({ table }) => (
      <Checkbox
        className="size-5"
        checked={table.getIsAllRowsSelected()}
        onClick={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => {
      return (
        <div
          className="flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            className="size-5"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onClick={row.getToggleSelectedHandler()}
          />
        </div>
      );
    },
  }),

  // header: ({ table }) => (
  //   <IndeterminateCheckbox
  //     {...{
  //       checked: table.getIsAllRowsSelected(),
  //       indeterminate: table.getIsSomeRowsSelected(),
  //       onChange: table.getToggleAllRowsSelectedHandler(),
  //     }}
  //   />
  // ),
  // cell: ({ row }) => (
  //   <div className="px-1">
  //     <IndeterminateCheckbox
  //       {...{
  //         checked: row.getIsSelected(),
  //         disabled: !row.getCanSelect(),
  //         indeterminate: row.getIsSomeSelected(),
  //         onChange: row.getToggleSelectedHandler(),
  //       }}
  //     />

  // columnHelper.accessor((row) => row.payload.fio, {
  //   id: 'fio',
  //   header: 'Заявитель',
  //   size: 120,
  //   enableSorting: true,
  //   cell: (props) => {
  //     return <ApplicantCell {...props} />;
  //   },
  // }),

  columnHelper.accessor((row): string => 'status.name', {
    id: 'status',
    header: 'Статус',
    size: 150,
    enableSorting: true,
    cell: (props) => {
      return <CaseStatusCell {...props} />;
    },
  }),

  columnHelper.accessor(
    (row): string =>
      row?.payload?.externalCases?.map((d) => d.num)?.join(', ') || '',
    {
      id: 'externalCases',
      header: 'Обращение',
      size: 100,
      enableSorting: true,
      cell: (props) => {
        return <ExternalCasesCell {...props} />;
      },
    },
  ),

  columnHelper.accessor('payload.description', {
    id: 'description',
    header: 'Описание',
    size: 300,
    enableSorting: true,
    cell: (props) => {
      return <CaseDesctiptionCell {...props} />;
    },
  }),

  columnHelper.accessor(
    (row) => row?.payload?.directions?.map((d) => d.name)?.join(', ') || '-',
    {
      id: 'directions',
      header: 'Направления',
      size: 190,
      enableSorting: true,
      cell: (props) => {
        return <DirectionCell {...props} />;
      },
    },
  ),

  columnHelper.accessor('payload.type.name', {
    id: 'type',
    header: 'Тип проблемы',
    size: 200,
    enableSorting: true,
    cell: (props) => {
      return <CaseTypeCell {...props} />;
    },
  }),
];
