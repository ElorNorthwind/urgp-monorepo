import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Toaster, TooltipProvider } from '@urgp/client/shared';
import {
  OptionsNavbar,
  RenovationNavbar,
  UserMenu,
} from '@urgp/client/widgets';

export const Route = createFileRoute('/renovation')({
  component: () => (
    <TooltipProvider delayDuration={200} skipDelayDuration={100}>
      <div className="bg-muted/60 flex min-h-screen w-full flex-col">
        <aside className="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col justify-between border-r p-2 sm:flex">
          <RenovationNavbar />
          <UserMenu />
          {/* <OptionsNavbar /> */}
        </aside>
        <main className="relative flex flex-1 flex-col gap-2 p-2 sm:pl-16">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </TooltipProvider>
  ),
});
