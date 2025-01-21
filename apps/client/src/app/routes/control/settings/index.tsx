import { createFileRoute } from '@tanstack/react-router';
import { ControlAccountPage } from '@urgp/client/pages';

export const Route = createFileRoute('/control/settings/')({
  component: () => <ControlAccountPage />,
});
