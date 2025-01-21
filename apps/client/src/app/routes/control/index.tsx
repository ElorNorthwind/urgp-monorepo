import { createFileRoute, redirect } from '@tanstack/react-router';
import { ControlCasesPage } from '@urgp/client/pages';
import { casesPageSearch } from '@urgp/shared/entities';

export const Route = createFileRoute('/control/')({
  beforeLoad: () => {
    throw redirect({ to: '/control/cases' });
  },
  component: () => <ControlCasesPage />,
  validateSearch: (search) => {
    return casesPageSearch.parse(search);
  },
});
