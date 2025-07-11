import { Separator } from '@radix-ui/react-separator';
import { useLocation, useMatch, useNavigate } from '@tanstack/react-router';
import {
  Button,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { CaseClasses, CaseFull, EquityObject } from '@urgp/shared/entities';
import { ChevronDown, X } from 'lucide-react';
import { equityObjectTypeStyles } from '../../../equityClassificators';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';

type EquityObjectCardHeaderProps = {
  className?: string;
  equityObject: EquityObject;
  onClose?: () => void;
  total?: number;
  filtered?: number;
  onPrevRow?: () => void;
  onNextRow?: () => void;
};

const EquityObjectCardHeader = (
  props: EquityObjectCardHeaderProps,
): JSX.Element => {
  const {
    className,
    equityObject,
    onClose,
    onNextRow: onNextCase,
    onPrevRow: onPrevCase,
  } = props;
  const pathname = useLocation().pathname;
  const navigate = useNavigate({ from: pathname });

  const {
    icon: TypeIcon,
    iconStyle,
    label,
  } = equityObjectTypeStyles?.[equityObject?.objectTypeId || 0] ||
  Object.values(equityObjectTypeStyles)[0];

  return (
    <div
      className={cn(
        'bg-muted-foreground/5 flex w-full flex-shrink-0 justify-center gap-2 truncate p-4',
        className,
      )}
    >
      {TypeIcon && (
        <TypeIcon className={cn('size-6 flex-shrink-0', iconStyle)} />
      )}

      {equityObject && (
        <Tooltip>
          <TooltipTrigger>
            <p className="border-foreground/20 text-muted-foreground bg-muted-foreground/5 h-full flex-shrink truncate rounded-r border-l px-2">
              {equityObject?.addressConstructionShort || ''}
            </p>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent>
              <TooltipArrow />
              <p>
                {'Строительный адрес объекта: ' +
                  equityObject?.addressConstructionShort +
                  ' ' +
                  label +
                  ' ' +
                  equityObject?.numProject}
              </p>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}

      {equityObject && (
        <h1
          className="font-bold"
          // TBD: Отдельная страница с объектом
          // onClick={() =>
          //   navigate({
          //     to: `/control/case`,
          //     search: { id: controlCase?.id },
          //     // params: { caseId: controlCase?.id },
          //   })
          // }
        >
          {equityObject?.addressShort + ' ' + label + ' ' + equityObject?.num}
        </h1>
      )}

      {equityObject && (
        <p className="border-foreground/20 text-muted-foreground h-full flex-shrink truncate border-l pl-2">
          {'ЖК ' + equityObject?.complexName || ''}
        </p>
      )}
      {onClose && (
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
          <Separator className="border-foreground/20 border-l" />
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

export { EquityObjectCardHeader };
