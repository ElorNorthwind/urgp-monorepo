import {
  Button,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { CaseClasses, CaseFull } from '@urgp/shared/entities';

import { useNavigate } from '@tanstack/react-router';
import { directionCategoryStyles } from '@urgp/client/entities';
import { CardTab } from '@urgp/client/features';

type ConnectedCasesTabProps = {
  controlCase?: CaseFull;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const ConnectedCasesTab = (
  props: ConnectedCasesTabProps,
): JSX.Element | null => {
  const {
    controlCase,
    className,
    label,
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

  const navigate = useNavigate();

  const connections =
    controlCase?.class === CaseClasses.problem
      ? controlCase?.connectionsFrom
      : controlCase?.connectionsTo;

  const correctLabel =
    label === undefined
      ? controlCase?.class === CaseClasses.problem
        ? 'Связанные происшествия'
        : 'Системные проблемы'
      : label;

  if (!controlCase || !connections || connections?.length === 0) return null;

  return (
    <CardTab
      label={correctLabel}
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn('flex flex-wrap gap-2', contentClassName)}
      accordionItemName={accordionItemName}
    >
      {connections.map((connection) => (
        <Tooltip key={connection?.id || '-'}>
          <TooltipTrigger asChild>
            <Button
              role="button"
              className="bg-muted-foreground/5 hover:bg-muted-foreground/10 flex h-6 flex-row items-center gap-1 rounded-full p-2"
              variant="outline"
              key={(connection?.id || '-') + '_button'}
              size="sm"
              onClick={() => {
                navigate({
                  to:
                    controlCase?.class === CaseClasses.problem
                      ? '/control/cases'
                      : '/control/problems',
                  search: {
                    selectedCase: connection.id,
                  },
                });
              }}
            >
              {connection?.departments &&
                connection?.departments?.length > 0 &&
                connection?.departments.map((d) => (
                  <div
                    key={d}
                    className={cn(
                      'size-3 rounded-full',
                      directionCategoryStyles?.[d].iconStyle || 'bg-slate-500',
                    )}
                  />
                ))}
              <span>{connection?.title}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="grid max-w-96 grid-cols-[auto_1fr] p-0 [&>*]:px-2 [&>*]:py-1">
            <div className="bg-muted-foreground/5 border-b border-r text-right font-bold">
              {connection?.class === CaseClasses.incident
                ? 'ФИО:'
                : 'Название:'}
            </div>
            <div className="border-b">{connection?.title}</div>
            {connection?.class === CaseClasses.incident && (
              <>
                <div className="bg-muted-foreground/5 border-b border-r text-right font-bold">
                  {'Адрес:'}
                </div>
                <div className="border-b">{connection?.extra}</div>
              </>
            )}
            {connection?.departments && connection?.departments.length > 0 && (
              <>
                <div className="bg-muted-foreground/5 border-b border-r text-right font-bold">
                  {'Управления:'}
                </div>
                <div className="border-b">
                  {connection?.departments.join(', ')}
                </div>
              </>
            )}
            <div className="text-muted-foreground col-span-2 p-2 text-xs">
              {connection?.notes}
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </CardTab>
  );
};

export { ConnectedCasesTab };
