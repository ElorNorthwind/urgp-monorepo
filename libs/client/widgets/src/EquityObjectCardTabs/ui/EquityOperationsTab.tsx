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
  EquityObject,
  OperationClasses,
} from '@urgp/shared/entities';

import { CardTab } from '@urgp/client/features';
import { Fragment, useMemo } from 'react';
import { format, isAfter, isBefore } from 'date-fns';
import {
  CreateDispatchButton,
  CreateStageButton,
  EditDispatchButton,
  EquityOperationsList,
  StagesList,
  useEquityOperations,
  useOperations,
} from '@urgp/client/entities';
import { BedSingle, CirclePower, Repeat } from 'lucide-react';

type EquityOperationsTabProps = {
  equityObject?: EquityObject;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const EquityOperationsTab = (
  props: EquityOperationsTabProps,
): JSX.Element | null => {
  const {
    equityObject,
    className,
    label = 'Работа с объектом',
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

  const {
    data: operations,
    isLoading,
    isFetching,
  } = useEquityOperations(equityObject?.id || 0, {
    skip: !equityObject?.id || equityObject?.id === 0,
  });

  return (
    <CardTab
      label={label}
      // button={
      //   <CreateStageButton
      //     caseId={0}
      //     className="absolute right-6 top-3 h-8 px-2 py-1"
      //   />
      // }
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn(
        'p-0 border rounded-lg bg-transparent',
        accordionItemName ? 'border-b-0 rounded-b-none' : '',
        contentClassName,
      )}
      accordionItemName={accordionItemName}
    >
      <EquityOperationsList
        operations={operations}
        isLoading={isLoading || isFetching}
        className="border-0"
      />
    </CardTab>
  );
};

export { EquityOperationsTab };
