import { TooltipPortal } from '@radix-ui/react-tooltip';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import {
  Button,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { Gauge, MailQuestion, TableProperties } from 'lucide-react';

const RenovationNavbar = (): JSX.Element => {
  const router = useRouterState();
  const navigate = useNavigate();

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
            <TableProperties className="" />
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
    </nav>
  );
};

export { RenovationNavbar };
