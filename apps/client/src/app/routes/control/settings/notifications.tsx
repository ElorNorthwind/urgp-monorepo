import { createFileRoute } from '@tanstack/react-router';
import {
  ControlFilterSettingsPage,
  ControlNotificationsSettingsPage,
} from '@urgp/client/pages';
import { userNotificationSettingsSchema } from '@urgp/shared/entities';

export const Route = createFileRoute('/control/settings/notifications')({
  component: () => <ControlNotificationsSettingsPage />,
  validateSearch: (search) => {
    return userNotificationSettingsSchema.parse(search);
  },
});
