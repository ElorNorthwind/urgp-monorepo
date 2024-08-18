import { createFileRoute } from '@tanstack/react-router';
import { OldApartmentsPage } from '@urgp/client/pages';
import { oldApartmetsSearch } from '@urgp/shared/entities';

export const Route = createFileRoute('/renovation/oldapartments')({
  component: () => <OldApartmentsPage />,
  validateSearch: (search) => {
    return oldApartmetsSearch.parse(search);
  },
});
