import { TooltipPortal } from '@radix-ui/react-tooltip';
import {
  Link,
  redirect,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
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
  useAuth,
  useIsMobile,
  useLogoutMutation,
} from '@urgp/client/shared';
import { CircleUser, KeyRound, LogOut, PenLine, User } from 'lucide-react';
import { useDispatch } from 'react-redux';

type EquityUserMenuProps = {
  className?: string;
};

const EquityUserMenu = ({ className }: EquityUserMenuProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const user = useAuth(); //selectCurrentUser(store.getState());
  const isMobile = useIsMobile();
  const router = useRouterState();

  if (isMobile) {
    return (
      <>
        {!user || user?.id === 0 ? (
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
            {user?.realUser?.fio && (
              <span className="text-muted-foreground -mt-2 mb-2 font-thin">
                {user?.realUser?.fio}
              </span>
            )}
            <Link
              to="/equity/settings"
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'text-muted-foreground flex size-9 w-full items-center justify-start gap-2 p-6',
                router.location.pathname.includes('/equity/settings') &&
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
          <DropdownMenuLabel className="flex flex-col gap-1">
            <span>{user?.fio || 'Гость'}</span>
            {user?.realUser?.fio && (
              <span className="text-muted-foreground font-thin">
                {'(' + user?.realUser?.fio + ')'}
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!user || user?.id === 0 ? (
            <DropdownMenuItem
              onSelect={() =>
                navigate({
                  to: '/login',
                  search: {
                    redirect: location.pathname,
                    params: JSON.stringify(location.search),
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
                    to: '/equity/settings',
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

export { EquityUserMenu };
