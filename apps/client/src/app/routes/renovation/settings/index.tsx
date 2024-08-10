import { createFileRoute } from '@tanstack/react-router';
import { AccountPage } from '@urgp/client/pages';

export const Route = createFileRoute('/renovation/settings/')({
  component: () => <AccountPage />,
});
