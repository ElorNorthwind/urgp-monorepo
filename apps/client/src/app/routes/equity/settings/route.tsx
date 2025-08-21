import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { EquitySettingsNavbar } from '@urgp/client/pages';
import { cn, ScrollArea, Separator, store } from '@urgp/client/shared';

export const Route = createFileRoute('/equity/settings')({
  beforeLoad: async ({ location }) => {
    const user = store.getState().auth.user;
    if (!user || user.id === 0) {
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.pathname,
        },
      });
    }
  },
  component: () => (
    <ScrollArea
      className={cn(
        'bg-muted-foreground/5  flex h-screen min-h-screen flex-1 flex-col overflow-auto',
      )}
    >
      <div className="block space-y-6 p-10 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Настройки</h2>
            <p className="text-muted-foreground">
              Пользовательские настройки приложения
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:-mx-4 lg:w-1/5">
              <EquitySettingsNavbar className="sticky top-4" />
            </aside>
            <div className="flex-1 overflow-y-auto lg:max-w-2xl">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  ),
});
