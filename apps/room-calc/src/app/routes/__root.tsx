import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { MainLayout } from '@urgp/ui';
import { Calculator } from 'lucide-react';

export const Route = createRootRoute({
  component: () => (
    <MainLayout
      header={
        <div className="flex gap-4 px-4 py-2">
          <Calculator className="stroke-accent-foreground" />
          <Link to="/" className="[&.active]:font-bold">
            Главная
          </Link>{' '}
          <Link to="/about" className="[&.active]:font-bold">
            Справка
          </Link>
        </div>
      }
      content={
        <>
          <Outlet />
          <TanStackRouterDevtools />
        </>
      }
    />
  ),
});
