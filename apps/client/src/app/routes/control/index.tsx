import { createFileRoute } from '@tanstack/react-router';
import { ControlDashboardPage } from '@urgp/client/pages';
import { casesPageSearch } from '@urgp/shared/entities';

export const Route = createFileRoute('/control/')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  component: () => <ControlDashboardPage />,
  validateSearch: (search) => {
    return casesPageSearch.parse(search);
  },
});
