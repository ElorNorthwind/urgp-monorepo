import { createFileRoute } from '@tanstack/react-router';
import { ControlCasesPage } from '@urgp/client/pages';
import { SidebarProvider, usePageMeta } from '@urgp/client/shared';
import { ControlNavbar } from '@urgp/client/widgets';
import { casesPageSearch } from '@urgp/shared/entities';

export const Route = createFileRoute('/control')({
  component: () => {
    usePageMeta('Кон(троль)', '/control.ico');
    return (
      <SidebarProvider cookieName="filter-sidebar" defaultOpen={false}>
        <ControlNavbar />
        <ControlCasesPage />
      </SidebarProvider>
    );
  },
  validateSearch: (search) => {
    return casesPageSearch.parse(search);
  },
});
