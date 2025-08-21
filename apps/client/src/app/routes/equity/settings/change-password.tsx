import { createFileRoute } from '@tanstack/react-router';
import { EquityChangePasswordPage } from '@urgp/client/pages';

export const Route = createFileRoute('/equity/settings/change-password')({
  component: () => <EquityChangePasswordPage />,
});
