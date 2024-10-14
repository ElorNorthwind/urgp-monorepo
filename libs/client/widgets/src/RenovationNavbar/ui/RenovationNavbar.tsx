import { TooltipPortal } from '@radix-ui/react-tooltip';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import {
  Button,
  cn,
  selectCurrentUser,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import {
  Gauge,
  House,
  MailQuestion,
  Map,
  SquareGanttChart,
  Users,
} from 'lucide-react';
import { useSelector } from 'react-redux';

const RenovationNavbar = (): JSX.Element => {
  const router = useRouterState();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  return (
    <nav className="items-centergap-4 flex flex-col gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="flex p-0"
            onClick={() => navigate({ to: '/renovation' })}
            disabled={router.location.pathname === '/renovation'}
          >
            <Gauge className="" />
          </Button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="right">Главная</TooltipContent>
        </TooltipPortal>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              'text-muted-foreground flex p-0',
              router.location.pathname === '/renovation/oldbuildings' &&
                'bg-muted-foreground/10 text-primary',
            )}
            disabled={router.location.pathname === '/renovation/oldbuildings'}
            variant="ghost"
            onClick={() => navigate({ to: '/renovation/oldbuildings' })}
          >
            <House className="" />
          </Button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="right" className="">
            Отселяемые дома
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              'text-muted-foreground flex p-0',
              router.location.pathname === '/renovation/oldapartments' &&
                'bg-muted-foreground/10 text-primary',
            )}
            disabled={router.location.pathname === '/renovation/oldapartments'}
            variant="ghost"
            onClick={() => navigate({ to: '/renovation/oldapartments' })}
          >
            <Users className="" />
          </Button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="right" className="">
            Квартирны в отселяемых домах
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              'text-muted-foreground flex p-0',
              router.location.pathname ===
                '/renovation/building-relocation-map' &&
                'bg-muted-foreground/10 text-primary',
            )}
            disabled={
              router.location.pathname === '/renovation/building-relocation-map'
            }
            variant="ghost"
            onClick={() =>
              navigate({ to: '/renovation/building-relocation-map' })
            }
          >
            <Map className="" />
          </Button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="right" className="">
            Карта отселяемых домов
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
      {user && user.id !== 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                'text-muted-foreground flex p-0',
                router.location.pathname === '/renovation/messages' &&
                  'bg-muted-foreground/10 text-primary',
              )}
              disabled={router.location.pathname === '/renovation/messages'}
              variant="ghost"
              onClick={() => navigate({ to: '/renovation/messages' })}
            >
              <MailQuestion className="" />
            </Button>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="right" className="">
              Сообщения, требующие ответа
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}
      {user &&
        user.id !== 0 &&
        (user.roles.includes('admin') ||
          user.roles.includes('editor') ||
          user.roles.includes('boss')) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  'text-muted-foreground flex p-0',
                  router.location.pathname === '/renovation/stages' &&
                    'bg-muted-foreground/10 text-primary',
                )}
                disabled={router.location.pathname === '/renovation/stages'}
                variant="ghost"
                onClick={() => navigate({ to: '/renovation/stages' })}
              >
                <SquareGanttChart className="" />
              </Button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent side="right" className="">
                Этапы, требующие согласования
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        )}
    </nav>
  );
};

export { RenovationNavbar };
