import { TooltipPortal, TooltipProvider } from '@radix-ui/react-tooltip';
import { useRouterState } from '@tanstack/react-router';
import {
  Button,
  cn,
  NAVBAR_WIDTH,
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
import { Drama, Menu } from 'lucide-react';
import { items } from '../config/items';
import { buttonVariants } from '@urgp/client/shared';
import { UserMenu } from '../../UserMenu';

const ControlNavbar = (): JSX.Element => {
  const router = useRouterState();
  // const navigate = useNavigate();
  // const user = useSelector(selectCurrentUser);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="fixed bottom-2 left-2 z-[50] size-10 rounded-full"
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
              <Drama />
              <span>ИС Кон(троль)</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2">
            {items.map((item, index) => (
              <a
                key={item.url + index}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'text-muted-foreground flex size-9 w-full items-center justify-start gap-2 p-4',
                  router.location.pathname === item.url &&
                    item.title === 'Home' &&
                    'bg-muted-foreground/10 text-sidebar-foreground pointer-events-none cursor-auto',
                )}
                href={item.url}
              >
                <item.icon />
                <span>{item.title}</span>
              </a>
            ))}
            {/* <UserMenu className="mt-auto" /> */}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <nav
        className={cn(
          'h-screen w-[--sidebar-width]',
          isMobile ? 'hidden' : 'flex',
          'bg-sidebar text-sidebar-foreground flex-col items-center gap-4 border-r py-2',
        )}
        style={
          {
            '--sidebar-width': NAVBAR_WIDTH,
          } as React.CSSProperties
        }
      >
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <a
              className={cn(
                buttonVariants({ variant: 'default' }),
                'size-10 flex p-0',
                // router.location.pathname === '/control' &&
                //   'pointer-events-none cursor-auto',
              )}
              href={'/control'}
            >
              <Drama />
            </a>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="right">Дашборд ИС Кон(троль)</TooltipContent>
          </TooltipPortal>
        </Tooltip> */}
        {items.map((item, index) => (
          <Tooltip key={item.url + index}>
            <TooltipTrigger asChild>
              <a
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'text-muted-foreground flex size-9 p-0',
                  router.location.pathname === item.url &&
                    item.title === 'Home' &&
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
        <UserMenu className="mt-auto" />
      </nav>
    </TooltipProvider>
  );
};

export { ControlNavbar };
