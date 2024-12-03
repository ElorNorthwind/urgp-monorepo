import { createColumnHelper } from '@tanstack/react-table';
import { CaseWithStatus } from '@urgp/shared/entities';
import { ApplicantCell } from './cells/ApplicantCell';

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
    id: 'actions',
    size: 70,
    header: 'Согласование',
    cell: (props) => {
      return (
        <div {...props} className="flex items-center justify-center">
          <input type="checkbox" />
        </div>
      );
    },
  }),

  columnHelper.accessor((row) => row.payload.fio, {
    id: 'fio',
    header: 'Заявитель',
    size: 150,
    enableSorting: true,
    cell: (props) => {
      return <ApplicantCell {...props} />;
    },
  }),

  columnHelper.accessor(
    (row) => row?.payload?.directions.map((d) => d.name)?.join(',') || '-',
    {
      id: 'directions',
      header: 'Направления',
      size: 200,
      enableSorting: true,
      // cell: (props) => {
      //   return <ApartmentCell {...props} />;
      // },
    },
  ),

  columnHelper.accessor(
    (row): string => row?.payload?.externalCases?.[0]?.num || '',
    {
      id: 'externalCases',
      header: 'Обращение',
      size: 200,
      enableSorting: true,
      // cell: (props) => {
      //   return <ApartmentCell {...props} />;
      // },
    },
  ),
  columnHelper.accessor('payload.description', {
    id: 'description',
    header: 'Описание',
    size: 300,
    enableSorting: true,
    // cell: (props) => {
    //   return <MessageCell {...props} />;
    // },
  }),
];
