import {
  cn,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import {
  CaseFull,
  CONTROL_THRESHOLD,
  OperationClasses,
} from '@urgp/shared/entities';

import { CardTab } from '@urgp/client/features';
import { Fragment, useMemo } from 'react';
import { isBefore } from 'date-fns';
import {
  CreateDispatchButton,
  CreateStageButton,
  EditDispatchButton,
  StagesList,
  useOperations,
} from '@urgp/client/entities';
import { BedSingle, CirclePower, Repeat } from 'lucide-react';

type StagesTabProps = {
  controlCase?: CaseFull;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const StagesTab = (props: StagesTabProps): JSX.Element | null => {
  const {
    controlCase,
    className,
    label = 'Работа с делом',
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

  const {
    data: stages,
    isLoading,
    isFetching,
  } = useOperations(
    { class: OperationClasses.stage, case: controlCase?.id || 0 },
    { skip: !controlCase?.id || controlCase?.id === 0 },
  );

  return (
    <CardTab
      label={label}
      button={
        <CreateStageButton
          caseId={controlCase?.id || 0}
          className="absolute right-6 top-3 h-8 px-2 py-1"
        />
      }
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn(
        'p-0 border rounded-lg bg-transparent',
        accordionItemName ? 'border-b-0 rounded-b-none' : '',
        contentClassName,
      )}
      accordionItemName={accordionItemName}
    >
      <StagesList
        stages={stages}
        isLoading={isLoading || isFetching}
        className="border-0"
        controlLevel={controlCase?.controlLevel || 0}
      />
    </CardTab>
  );
};

export { StagesTab };
