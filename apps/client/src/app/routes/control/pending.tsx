import { createFileRoute } from '@tanstack/react-router';
import { PendingCasesPage } from '@urgp/client/pages';
import { casesPageSearch } from '@urgp/shared/entities';

export const Route = createFileRoute('/control/pending')({
  component: () => <PendingCasesPage />,
  validateSearch: (search) => {
    return casesPageSearch.parse(search);
  },
});
