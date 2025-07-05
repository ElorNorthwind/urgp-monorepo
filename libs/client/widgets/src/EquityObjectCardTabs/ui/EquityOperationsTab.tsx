import { cn, setOperationFormValuesEmpty } from '@urgp/client/shared';
import { EquityObject } from '@urgp/shared/entities';

import {
  CreateEquityOperationButton,
  EquityOperationsList,
  useEquityOperations,
} from '@urgp/client/entities';
import { CardTab } from '@urgp/client/features';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();

  const {
    data: operations,
    isLoading,
    isFetching,
  } = useEquityOperations(equityObject?.id || 0, {
    skip: !equityObject?.id || equityObject?.id === 0,
  });

  useEffect(() => {
    dispatch(setOperationFormValuesEmpty());
  }, [equityObject?.id]);

  return (
    <CardTab
      label={label}
      button={
        <CreateEquityOperationButton
          fio={equityObject?.creditor?.split('; ')[0]}
          objectId={equityObject?.id}
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
      <EquityOperationsList
        operations={operations}
        isLoading={isLoading || isFetching}
        className="border-0"
      />
    </CardTab>
  );
};

export { EquityOperationsTab };
