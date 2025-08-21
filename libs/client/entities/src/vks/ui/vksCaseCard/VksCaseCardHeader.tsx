import { Separator } from '@radix-ui/react-separator';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { useLocation, useNavigate } from '@tanstack/react-router';
import {
  Button,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useAuth,
} from '@urgp/client/shared';
import { VksCaseDetails } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { ChevronDown, X } from 'lucide-react';
import { vksCaseStatusStyles } from '../../config/vksStyles';

type VksCaseCardHeaderProps = {
  className?: string;
  entity?: VksCaseDetails;
  onClose?: () => void;
  total?: number;
  filtered?: number;
  onPrevRow?: () => void;
  onNextRow?: () => void;
};

const VksCaseCardHeader = (props: VksCaseCardHeaderProps): JSX.Element => {
  const {
    className,
    entity,
    onClose,
    onNextRow: onNextCase,
    onPrevRow: onPrevCase,
  } = props;
  const pathname = useLocation().pathname;
  const navigate = useNavigate({ from: pathname });
  const user = useAuth();
  const isAuthorized = user?.id && user?.id !== 0 ? true : false;

  const { icon: StatusIcon, iconStyle } =
    vksCaseStatusStyles?.[
      (entity?.status || '') as keyof typeof vksCaseStatusStyles
    ] || Object.values(vksCaseStatusStyles)[0];

  return (
    <div
      className={cn(
        'bg-muted-foreground/5 flex w-full flex-shrink-0 justify-center gap-2 truncate p-4',
        className,
      )}
    >
      {StatusIcon && (
        <StatusIcon className={cn('size-6 flex-shrink-0', iconStyle)} />
      )}

      {entity?.date && (
        <Tooltip>
          <TooltipTrigger>
            <p className="border-foreground/20 text-muted-foreground bg-muted-foreground/5 h-full flex-shrink truncate rounded-r border-l px-2">
              {format(entity?.date, 'dd.MM.yyyy') +
                ' ' +
                entity?.time?.slice(0, 5) || ''}
            </p>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent>
              <TooltipArrow />
              <p>
                {'Дата записи: ' +
                  (entity?.bookingDate &&
                    format(entity?.bookingDate, 'dd.MM.yyyy')) || '-'}
              </p>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}

      {entity && (
        <h1 className="truncate font-bold">
          {isAuthorized
            ? entity?.clientFio || ''
            : 'Данные скрыты до авторизации'}
        </h1>
      )}

      {onClose && (
        <>
          {(onPrevCase || onNextCase) && (
            <>
              <Button
                role="button"
                variant="ghost"
                className="ml-auto size-6 p-0"
                onClick={() => onPrevCase && onPrevCase()}
                disabled={!onPrevCase}
              >
                <ChevronDown className="size-5 rotate-180" />
              </Button>
              <Button
                role="button"
                variant="ghost"
                className="size-6 p-0"
                onClick={() => onNextCase && onNextCase()}
                disabled={!onNextCase}
              >
                <ChevronDown className="size-5" />
              </Button>
            </>
          )}
          <Separator
            className={cn(
              'border-foreground/20',
              onPrevCase || onNextCase ? 'border-l' : 'ml-auto',
            )}
          />
          <Button
            role="button"
            variant="ghost"
            className="size-6 p-0"
            onClick={() => onClose && onClose()}
            disabled={!onClose}
          >
            <X className="size-5" />
          </Button>
        </>
      )}
    </div>
  );
};

export { VksCaseCardHeader };
