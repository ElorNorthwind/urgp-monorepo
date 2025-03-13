import { createFileRoute, Outlet } from '@tanstack/react-router';
import {
  cn,
  ScrollArea,
  SidebarProvider,
  usePageMeta,
} from '@urgp/client/shared';

export const Route = createFileRoute('/xml')({
  component: () => {
    usePageMeta('Генератор XML к распоряжениям', '/favicon.ico');
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
