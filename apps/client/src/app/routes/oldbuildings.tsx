import { createFileRoute } from '@tanstack/react-router';
import { useOldBuldings } from '@urgp/client/entities';
import { OldBuildingsPage } from '@urgp/client/pages';
import { rtkApi, store } from '@urgp/client/shared';
import { getOldBuldings } from '@urgp/shared/entities';

// import { z } from 'zod';

// export const getOldBuldings = z
//   .object({
//     limit: z.coerce.number().min(1).max(500).default(100).or(z.literal('ALL')),
//     page: z.coerce.number().min(1).default(1),
//     okrug: z.string(),
//     districts: z.string().array(),
//     relocationType: z.number().array(),
//     status: z.number().array(),
//     dificulty: z.number().array(),
//     deviation: z.enum(['done', 'normal', 'attention', 'risk']).array(),
//     relocationAge: z
//       .enum(['done', 'notStarted', '1', '2', '5', '8', 'more'])
//       .array(),
//     relocationStatus: z
//       .enum([
//         'done',
//         'demolition',
//         'secondResetlement',
//         'firstResetlement',
//         'notStarted',
//       ])
//       .array(),
//     adress: z.string(),
//   })
//   .partial();

// export type GetOldBuldingsDto = z.infer<typeof getOldBuldings>;

// export const relocationDeviations = {
//   done: 'Завершено',
//   normal: 'Без отклонений',
//   attention: 'Требует внимания',
//   risk: 'Есть риски',
// };

// export const relocationAge = {
//   done: 'Завершено',
//   notStarted: 'Не начато',
//   '1': 'Менее месяца',
//   '2': 'От 1 до 2 месяцев',
//   '5': 'От 2 до 5 месяцев',
//   '8': 'От 5 до 8 месяцев',
//   more: 'Более 8 месяцев',
// };

// export const relocationStatus = {
//   done: 'Завершено',
//   demolition: 'Снос',
//   secondResetlement: 'Отселение',
//   firstResetlement: 'Переселение',
//   notStarted: 'Не начато',
// };

export const Route = createFileRoute('/oldbuildings')({
  component: OldBuildings,
  // validateSearch: getOldBuldings,
  validateSearch: (search) => {
    return getOldBuldings.parse(search);
  },

  // loaderDeps: ({ search: dto }) => dto,
  // loader: (dto) => {
  //   // const promise = dispatch(api.endpoints.getPosts.initiate())
  //   // store.dispatch(rtkApi.endpoints.getOldBuildings.initiate())
  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //   useOldBuldings(dto.deps);
  // },
});

// rtkApi.endpoints.

function OldBuildings() {
  return <OldBuildingsPage />;
}
