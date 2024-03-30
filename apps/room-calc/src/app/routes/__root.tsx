import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { MainLayout } from '@urgp/ui';

export const Route = createRootRoute({
  component: () => (
    <MainLayout
      header={
        <div className="flex gap-2 p-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{' '}
          <Link to="/about" className="[&.active]:font-bold">
            About
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
