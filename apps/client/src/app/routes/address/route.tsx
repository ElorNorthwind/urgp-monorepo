import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import {
  CreateCaseDialog,
  CreateDispatchDialog,
  CreateProblemDialog,
  CreateReminderDialog,
  CreateStageDialog,
  EscalateDialog,
} from '@urgp/client/entities';
import { SidebarProvider, store, usePageMeta } from '@urgp/client/shared';
import { ApproveDialog, ControlNavbar } from '@urgp/client/widgets';

export const Route = createFileRoute('/address')({
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
    usePageMeta('Парсинг адресов', '/favicon.ico');
    return (
      <div className="font-roboto">
        <Outlet />
      </div>
    );
  },
});
