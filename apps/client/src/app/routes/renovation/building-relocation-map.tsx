import { createFileRoute } from '@tanstack/react-router';
import { BuildingRelocationMapPage } from '@urgp/client/pages';
import { relocationMapPageSerch } from '@urgp/shared/entities';

export const Route = createFileRoute('/renovation/building-relocation-map')({
  // component: () => <BuildingRelocationMapPage />,
  validateSearch: (search) => {
    return relocationMapPageSerch.parse(search);
  },
});
