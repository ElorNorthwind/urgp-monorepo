import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { SettingsNavbar } from '@urgp/client/pages';
import { Separator, store } from '@urgp/client/shared';

export const Route = createFileRoute('/renovation/settings')({
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
  component: () => (
    <div className="block space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Настройки</h2>
        <p className="text-muted-foreground">
          Пользовательские настройки приложения
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:-mx-4 lg:w-1/5">
          <SettingsNavbar />
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  ),
});
