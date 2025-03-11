import { createLazyFileRoute } from '@tanstack/react-router';
import { OldBuildingsPage } from '@urgp/client/pages';
import { oldBuildingsPageSearch } from '@urgp/shared/entities';

export const Route = createLazyFileRoute('/renovation/oldbuildings')({
  component: OldBuildings,
  // validateSearch: (search) => {
  //   return oldBuildingsPageSearch.parse(search)
  // },

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
