import { createFileRoute } from '@tanstack/react-router';
import { OldBuildingsPage } from '@urgp/client/pages';
import { getOldBuldings } from '@urgp/shared/entities';

export const Route = createFileRoute('/renovation/oldbuildings')({
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
