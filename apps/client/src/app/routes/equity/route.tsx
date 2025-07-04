import { createFileRoute, Outlet } from '@tanstack/react-router';
import { CreateEquityOperationDialog } from '@urgp/client/entities';
import {
  cn,
  ScrollArea,
  SidebarProvider,
  usePageMeta,
} from '@urgp/client/shared';
import { EquityNavbar } from '@urgp/client/widgets';

export const Route = createFileRoute('/equity')({
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
    usePageMeta('Дольщики', '/favicon.ico');
    return (
      <div className="font-roboto">
        <SidebarProvider cookieName="equity-sidebar" defaultOpen={false}>
          <EquityNavbar />
          <Outlet />
          <CreateEquityOperationDialog />
        </SidebarProvider>
      </div>
    );
  },
});
