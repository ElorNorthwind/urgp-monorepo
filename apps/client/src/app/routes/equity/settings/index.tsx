import { createFileRoute } from '@tanstack/react-router';
import { EquityAccountPage } from '@urgp/client/pages';

export const Route = createFileRoute('/equity/settings/')({
  component: () => <EquityAccountPage />,
});
