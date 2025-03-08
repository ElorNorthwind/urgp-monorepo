import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { addressApi } from '@urgp/client/entities';
import {
  cn,
  ScrollArea,
  SidebarProvider,
  store,
  usePageMeta,
} from '@urgp/client/shared';
import { AddressNavbar } from '@urgp/client/widgets';

export const Route = createFileRoute('/address')({
  beforeLoad: async ({ location }) => {
    // restart queue
    store.dispatch(addressApi.endpoints.refreshSessionsQueue.initiate());
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
  component: () => {
    usePageMeta('Поиск адресов', '/favicon.ico');
    return (
      <div className="font-roboto">
        <SidebarProvider cookieName="address-sidebar" defaultOpen={false}>
          <AddressNavbar />
          <ScrollArea
            className={cn(
              'bg-muted-foreground/5 flex h-screen min-h-screen flex-1 flex-col overflow-auto',
            )}
          >
            <Outlet />
          </ScrollArea>
        </SidebarProvider>
      </div>
    );
  },
});
