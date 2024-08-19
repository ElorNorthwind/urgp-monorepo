import { createFileRoute } from '@tanstack/react-router';
import { BuildingRelocationMapPage } from '@urgp/client/pages';
import { z } from 'zod';

export const Route = createFileRoute('/renovation/building-relocation-map')({
  component: () => <BuildingRelocationMapPage />,
  validateSearch: (search) => {
    return z.object({ buildingId: z.coerce.number().optional() }).parse(search);
  },
});
