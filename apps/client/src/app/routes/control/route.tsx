import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@urgp/client/shared';
import { ControlNavbar, ControlSidebar } from '@urgp/client/widgets';
import { useState } from 'react';

const ControlPageTest = (): JSX.Element => {
  const [open2, setOpen2] = useState(false);
  const [width, setWidth] = useState(400);

  return (
    <SidebarProvider
      open={open2}
      onOpenChange={setOpen2}
      style={
        {
          '--sidebar-width': width + 'px',
        } as React.CSSProperties
      }
    >
      <ControlNavbar />
      <SidebarInset>
        <SidebarInset>
          <main>
            <SidebarTrigger />
            <Button onClick={() => setOpen2((value) => !value)}>Open2</Button>
            <Button
              onClick={() => setWidth((value) => (value === 400 ? 700 : 400))}
            >
              size me
            </Button>
            <div>Hello /control!</div>
          </main>
        </SidebarInset>
        <ControlSidebar side="right" />
      </SidebarInset>
    </SidebarProvider>
  );
};

export const Route = createFileRoute('/control')({
  component: ControlPageTest,
});

// import {
//     createFileRoute,
//     Outlet,
//     ScrollRestoration,
//   } from '@tanstack/react-router';
//   import { Toaster, TooltipProvider } from '@urgp/client/shared';
//   import { RenovationNavbar, UserMenu } from '@urgp/client/widgets';

//   export const Route = createFileRoute('/control')({
//     component: () => (
//       <TooltipProvider delayDuration={200} skipDelayDuration={100}>
//         <div className="bg-muted/60 flex min-h-screen w-full flex-col">
//           <aside className="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col justify-between border-r p-2 sm:flex">
//             <RenovationNavbar />
//             <UserMenu />
//           </aside>
//           <main className="relative flex flex-1 flex-col gap-2 p-2 sm:pl-16">
//             <ScrollRestoration getKey={(location) => location.pathname} />
//             <Outlet />
//           </main>
//           <Toaster />
//         </div>
//       </TooltipProvider>
//     ),
//   });
