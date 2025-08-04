import { createFileRoute, Outlet } from '@tanstack/react-router';
import { SidebarProvider, usePageMeta } from '@urgp/client/shared';
import { VksNavbar } from '@urgp/client/widgets';

export const Route = createFileRoute('/vks')({
  // beforeLoad: async ({ location }) => {
  //   // restart queue
  //   store.dispatch(addressApi.endpoints.refreshSessionsQueue.initiate());
  //   const user = store.getState().auth.user;
  //   if (!user || user.id === 0) {
  //     throw redirect({
  //       to: '/login',
  //       search: {
  //         // Use the current location to power a redirect after login
  //         // (Do not use `router.state.resolvedLocation` as it can
  //         // potentially lag behind the actual current location)
  //         redirect: location.href,
  //       },
  //     });
  //   }
  // },

  component: () => {
    usePageMeta('Онлайн-консультации', '/vks.ico');
    return (
      <div className="font-roboto">
        <SidebarProvider cookieName="vks-sidebar" defaultOpen={false}>
          <VksNavbar />
          <Outlet />
        </SidebarProvider>
      </div>
    );
  },
});
