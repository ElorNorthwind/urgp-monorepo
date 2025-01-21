import { TooltipPortal } from '@radix-ui/react-tooltip';
import { useNavigate } from '@tanstack/react-router';
import {
  Button,
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
