import { createFileRoute } from '@tanstack/react-router';
import { ControlChangePasswordPage } from '@urgp/client/pages';

export const Route = createFileRoute('/control/settings/change-password')({
  component: () => <ControlChangePasswordPage />,
});
