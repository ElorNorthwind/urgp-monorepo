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

export const Route = createFileRoute('/xml')({
  component: () => {
    usePageMeta('Герератор XML к распоряжениям', '/favicon.ico');
    return (
      <div className="font-roboto">
        <SidebarProvider cookieName="xml-sidebar" defaultOpen={false}>
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
