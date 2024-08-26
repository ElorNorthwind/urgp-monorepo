import { createFileRoute, redirect } from '@tanstack/react-router';
import { MessagesPage } from '@urgp/client/pages';
import { store } from '@urgp/client/shared';
import { messagesPageSearch } from '@urgp/shared/entities';
import { z } from 'zod';

export const Route = createFileRoute('/renovation/messages')({
  component: () => <MessagesPage />,
  beforeLoad: async ({ location }) => {
    const user = store.getState().auth.user;
    if (!user || user.id === 0) {
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
  validateSearch: (search) => {
    return messagesPageSearch.parse(search);
  },
});
