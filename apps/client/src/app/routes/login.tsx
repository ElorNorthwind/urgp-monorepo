import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@urgp/client/pages';
import { store, usePageMeta } from '@urgp/client/shared';

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ location }) => {
    const user = store.getState().auth.user;
    if (user && user.id !== 0) {
      throw redirect({
        to: '/renovation',
        // search: {
        //   // Use the current location to power a redirect after login
        //   // (Do not use `router.state.resolvedLocation` as it can
        //   // potentially lag behind the actual current location)
        //   redirect: location.href,
        // },
      });
    }
  },

  component: () => {
    usePageMeta('Сервисы жилищного блока', '/favicon.ico');
    return <LoginPage />;
  },
});

// import { createFileRoute } from '@tanstack/react-router';
// import { MapPage } from '@urgp/client/pages';

// export const Route = createFileRoute('/login')({
//   component: Map,
// });

// function Map() {
//   return <MapPage />;
// }
