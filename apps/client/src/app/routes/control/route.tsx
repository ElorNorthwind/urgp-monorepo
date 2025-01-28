import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import {
  CreateCaseDialog,
  CreateDispatchDialog,
  CreateReminderDialog,
  CreateStageDialog,
} from '@urgp/client/entities';
import { SidebarProvider, store, usePageMeta } from '@urgp/client/shared';
import { ApproveDialog, ControlNavbar } from '@urgp/client/widgets';

export const Route = createFileRoute('/control')({
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
  component: () => {
    usePageMeta('Кон(троль)', '/control.ico');
    return (
      <div className="font-roboto">
        <SidebarProvider cookieName="filter-sidebar" defaultOpen={false}>
          <ControlNavbar />
          <Outlet />
          <CreateCaseDialog />
          <CreateStageDialog />
          <CreateDispatchDialog />
          <CreateReminderDialog />
          <ApproveDialog />
        </SidebarProvider>
      </div>
    );
  },
});
