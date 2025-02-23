import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  cn,
  getApproveInfo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import { CaseClasses, CaseFull } from '@urgp/shared/entities';

import { DirectionsChangeMenu } from '@urgp/client/widgets';
import { format } from 'date-fns';
import {
  CaseDirectionsList,
  caseStatusStyles,
  caseTypeStyles,
} from '@urgp/client/entities';
import { useNavigate } from '@tanstack/react-router';

type ConnectedCasesTabProps = {
  controlCase?: CaseFull;
  className?: string;
  accordion?: boolean;
  label?: string | null;
  labelClassName?: string;
};

const ConnectedCasesTab = (
  props: ConnectedCasesTabProps,
): JSX.Element | null => {
  const {
    controlCase,
    className,
    accordion = false,
    label,
    labelClassName,
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

  if (accordion)
    return (
      <>
        <AccordionItem value="connected" className="relative">
          <AccordionTrigger className={labelClassName}>
            {correctLabel}
          </AccordionTrigger>
          <AccordionContent className="bg-background rounded-t-lg border border-b-0 p-2">
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
          </AccordionContent>
        </AccordionItem>
      </>
    );

  return (
    <>
      {correctLabel && (
        <div className={cn('text-lg font-semibold', labelClassName)}>
          {correctLabel}
        </div>
      )}
      <div className="bg-background flex flex-wrap rounded-lg border p-2">
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
      </div>
    </>
  );
};

export { ConnectedCasesTab };
