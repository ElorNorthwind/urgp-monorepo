import { TooltipPortal, TooltipProvider } from '@radix-ui/react-tooltip';
import { useRouterState } from '@tanstack/react-router';
import {
  Button,
  buttonVariants,
  cn,
  NAVBAR_WIDTH,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import { Drama, MapPin, MapPinned, Menu } from 'lucide-react';
import { ControlUserMenu } from '../../ControlUserMenu';
import { items } from '../config/items';

const AddressNavbar = (): JSX.Element => {
  const router = useRouterState();

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              router?.location?.search?.selectedCase ? 'bottom-20' : 'bottom-2',
              'hover:bg-sidebar-accent fixed left-2 z-[50] size-12 rounded-full',
            )}
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="p-4"
          aria-description="Навигация"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="flex flex-row items-center gap-2">
              <MapPinned />
              <span>Поиск адресов</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 p-2 pb-6">
            {items.map((item, index) => (
              <a
                key={item.url + index}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'text-muted-foreground flex size-9 w-full items-center justify-start gap-2 p-6',
                  router.location.pathname === item.url &&
                    'bg-muted-foreground/10 text-sidebar-foreground pointer-events-none cursor-auto',
                )}
                href={item.url}
              >
                <item.icon />
                <span>{item.title}</span>
              </a>
            ))}
            <Separator className="my-4" />
            <ControlUserMenu className="mb-4" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <nav
        className={cn(
          'z-20 h-screen w-[--sidebar-width]',
          isMobile ? 'hidden' : 'flex',
          'bg-sidebar text-sidebar-foreground flex-col items-center gap-4 border-r py-2',
        )}
        style={
          {
            '--sidebar-width': NAVBAR_WIDTH,
          } as React.CSSProperties
        }
      >
        {items.map((item, index) => (
          <Tooltip key={item.url + index}>
            <TooltipTrigger asChild>
              <a
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'text-muted-foreground flex size-9 p-0',
                  router.location.pathname === item.url &&
                    'bg-muted-foreground/10 text-sidebar-foreground pointer-events-none cursor-auto',
                )}
                href={item.url}
              >
                <item.icon />
              </a>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent side="right">{item.title}</TooltipContent>
            </TooltipPortal>
          </Tooltip>
        ))}
        <ControlUserMenu className="mt-auto" />
      </nav>
    </TooltipProvider>
  );
};

export { AddressNavbar };
