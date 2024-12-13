import { createFileRoute, redirect } from '@tanstack/react-router';
import { PendingStagesPage } from '@urgp/client/pages';
import { store } from '@urgp/client/shared';
import { pendingStagesPageSearch } from '@urgp/shared/entities';

export const Route = createFileRoute('/renovation/stages')({
  component: () => <PendingStagesPage />,
  beforeLoad: async ({ location }) => {
    const user = store.getState().auth.user;
    if (!user || user.id === 0) {
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.pathname,
        },
      });
    }

    if (
      !(
        user.roles.includes('admin') ||
        user.roles.includes('editor') ||
        user.roles.includes('boss')
      )
    ) {
      throw redirect({
        to: '/renovation',
      });
    }
  },
  validateSearch: (search) => {
    return pendingStagesPageSearch.parse(search);
  },
});
