import { createFileRoute } from '@tanstack/react-router';
// import { oldBuildingsApi } from '@urgp/client/entities';
import { OldBuildingsPage } from '@urgp/client/pages';
// import { store } from '@urgp/client/shared';
import { getOldBuldings } from '@urgp/shared/entities';

export const Route = createFileRoute('/oldbuildings')({
  component: OldBuildings,
  validateSearch: (search) => {
    return getOldBuldings.omit({ offset: true }).parse(search);
  },

  // loaderDeps: ({ search: dto }) => dto,
  // loader: (dto) => {
  //   return store.dispatch(
  //     oldBuildingsApi.endpoints.getOldBuldings.initiate({
  //       ...dto.deps,
  //       limit: 1000,
  //     }),
  //   );
  // },
});

function OldBuildings() {
  return <OldBuildingsPage />;
}
