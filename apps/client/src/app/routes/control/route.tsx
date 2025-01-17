import { createFileRoute, redirect } from '@tanstack/react-router';
import { CreateCaseDialog, CreateStageDialog } from '@urgp/client/entities';
import { ControlCasesPage } from '@urgp/client/pages';
import { SidebarProvider, store, usePageMeta } from '@urgp/client/shared';
import { ControlNavbar } from '@urgp/client/widgets';
import { casesPageSearch } from '@urgp/shared/entities';

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
      <SidebarProvider cookieName="filter-sidebar" defaultOpen={false}>
        <ControlNavbar />
        <ControlCasesPage />
        <CreateCaseDialog />
        <CreateStageDialog />
      </SidebarProvider>
    );
  },
  validateSearch: (search) => {
    return casesPageSearch.parse(search);
  },
});
