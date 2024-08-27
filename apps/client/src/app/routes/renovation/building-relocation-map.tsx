import { createFileRoute } from '@tanstack/react-router';
import { BuildingRelocationMapPage } from '@urgp/client/pages';
import { relocationMapSerch } from '@urgp/shared/entities';

export const Route = createFileRoute('/renovation/building-relocation-map')({
  component: () => <BuildingRelocationMapPage />,
  validateSearch: (search) => {
    return relocationMapSerch.parse(search);
  },
});
