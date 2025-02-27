import { TooltipPortal } from '@radix-ui/react-tooltip';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import {
  Button,
  buttonVariants,
  clearUser,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  selectCurrentUser,
  store,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useIsMobile,
  useLogoutMutation,
} from '@urgp/client/shared';
import { CircleUser, KeyRound, LogOut, PenLine, User } from 'lucide-react';
import { useDispatch } from 'react-redux';

type ControlUserMenuProps = {
  className?: string;
};

const ControlUserMenu = ({ className }: ControlUserMenuProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const user = selectCurrentUser(store.getState());
  const isMobile = useIsMobile();
  const router = useRouterState();

  if (isMobile) {
    return (
      <>
        {!user || user?.fio === 'Гость' ? (
          <Link
            to="/login"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'text-muted-foreground flex size-9 w-full items-center justify-start gap-2 p-6',
              router.location.pathname === '/login' &&
                'bg-muted-foreground/10 text-sidebar-foreground pointer-events-none cursor-auto',
            )}
            search={() => ({
              redirect: location.pathname,
            })}
          >
            <KeyRound />
            <span>Войти</span>
          </Link>
        ) : (
          <>
            <span className="mb-2 text-lg font-bold">{user.fio}</span>
            <Link
              to="/control/settings"
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'text-muted-foreground flex size-9 w-full items-center justify-start gap-2 p-6',
                router.location.pathname.includes('/control/settings') &&
                  'bg-muted-foreground/10 text-sidebar-foreground pointer-events-none cursor-auto',
              )}
            >
              <User />
              <span>Настройки</span>
            </Link>
            <span
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'text-muted-foreground flex size-9 w-full items-center justify-start gap-2 p-6',
                router.location.pathname === '/login' &&
                  'bg-muted-foreground/10 text-sidebar-foreground pointer-events-none cursor-auto',
              )}
              onClick={() => {
                logout();
                dispatch(clearUser());
                navigate({
                  to: '/login',
                  search: {
                    redirect: location.pathname,
                  },
                });
              }}
            >
              <LogOut />
              <span>Выйти</span>
            </span>
          </>
        )}
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn('text-muted-foreground flex p-2', className)}
          variant="ghost"
          // onClick={(e) => e.preventDefault()}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleUser className="h-6 w-6" />
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent side="right" className="">
                Меню пользователя
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="mx-4">
          <DropdownMenuLabel>{user?.fio || 'Гость'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!user || user?.fio === 'Гость' ? (
            <DropdownMenuItem
              onSelect={() =>
                navigate({
                  to: '/login',
                  search: {
                    redirect: location.pathname,
                  },
                })
              }
            >
              <KeyRound className="mr-2 h-4 w-4" />
              <span>Войти</span>
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem
                onSelect={() => {
                  navigate({
                    to: '/control/settings',
                  });
                }}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Настройки</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  logout();
                  dispatch(clearUser());
                  navigate({
                    to: '/login',
                    search: {
                      redirect: location.pathname,
                    },
                  });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export { ControlUserMenu };
