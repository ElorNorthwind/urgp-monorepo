import { createFileRoute } from '@tanstack/react-router';
import { RenovationDashboardPage } from '@urgp/client/pages';

export const Route = createFileRoute('/renovation/')({
  component: () => <RenovationDashboardPage />,
});
