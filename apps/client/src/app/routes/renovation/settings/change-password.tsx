import { createFileRoute } from '@tanstack/react-router';
import { ChangePasswordPage } from '@urgp/client/pages';

export const Route = createFileRoute('/renovation/settings/change-password')({
  component: () => <ChangePasswordPage />,
});
