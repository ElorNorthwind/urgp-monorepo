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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  selectCurrentUser,
  store,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useLogoutMutation,
} from '@urgp/client/shared';
import { CircleUser, KeyRound, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';

type UserMenuProps = {
  className?: string;
};

const UserMenu = ({ className }: UserMenuProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const user = selectCurrentUser(store.getState());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn('text-muted-foreground flex p-2', className)}
              variant="ghost"
              onClick={(e) => e.preventDefault()}
            >
              <CircleUser className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="right" className="">
              Меню пользователя
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4">
        <DropdownMenuLabel>{user?.fio || 'Гость'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!user || user?.fio === 'Гость' ? (
          <DropdownMenuItem onSelect={() => navigate({ to: '/login' })}>
            <KeyRound className="mr-2 h-4 w-4" />
            <span>Войти</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onSelect={() => {
              logout();
              dispatch(clearUser());
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Выйти</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserMenu };
