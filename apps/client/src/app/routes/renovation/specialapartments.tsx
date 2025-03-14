import { createFileRoute } from '@tanstack/react-router';
import { SpecialApartmentsPage } from '@urgp/client/pages';
import { specialApartmentsSearchSchema } from '@urgp/shared/entities';

export const Route = createFileRoute('/renovation/specialapartments')({
  component: () => <SpecialApartmentsPage />,
  validateSearch: (search) => {
    return specialApartmentsSearchSchema.parse(search);
  },
});
