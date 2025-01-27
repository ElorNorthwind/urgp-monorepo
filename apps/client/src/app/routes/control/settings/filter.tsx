import { createFileRoute } from '@tanstack/react-router';
import { ControlFilterSettingsPage } from '@urgp/client/pages';
import { casesPageFilter } from '@urgp/shared/entities';

export const Route = createFileRoute('/control/settings/filter')({
  component: () => <ControlFilterSettingsPage />,
  validateSearch: (search) => {
    return casesPageFilter.parse(search);
  },
});
