import { Button, cn, useUserAbility } from '@urgp/client/shared';
import { CaseClasses, CaseFull } from '@urgp/shared/entities';

import { externalSystemStyles } from '@urgp/client/entities';
import { CardTab } from '@urgp/client/features';
import { format } from 'date-fns';
import { useNavigate } from '@tanstack/react-router';

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
        <Button
          role="button"
          className="bg-muted-foreground/5 hover:bg-muted-foreground/10 h-6 rounded-full p-2"
          variant="outline"
          key={connection.id}
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
          {connection.title}
        </Button>
      ))}
    </CardTab>
  );
};

export { ConnectedCasesTab };
