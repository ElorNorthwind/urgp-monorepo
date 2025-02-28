import { useCurrentUserApproveChains } from '@urgp/client/entities';
import { CardTab } from '@urgp/client/features';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
} from '@urgp/client/shared';
import { use } from 'passport';

import { cloneElement, ReactNode } from 'react';
import { ApproveChainItem } from './ApproveChainItem';
import { ApproveChainPath } from './ApproveChainPath';

type ApproveChainsProps = {
  label?: string | null;
  button?: JSX.Element;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};
const ApproveChainsTab = (props: ApproveChainsProps): JSX.Element | null => {
  const {
    label = 'Мои сценарии согласования',
    button,
    children,
    className,
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

  const { data, isLoading, isFetching } = useCurrentUserApproveChains();

  if (!data || isLoading || isFetching) return null;

  return (
    <CardTab
      label={label}
      // button={<ManageReminderButton caseId={controlCase?.id} />}
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn(
        'border-0 p-0',
        'gap-2 flex-col flex overflow-x-auto',
        contentClassName,
      )}
      accordionItemName={accordionItemName}
    >
      {data?.map((c, i) => (
        <ApproveChainPath
          key={c.key}
          path={c.path}
          className={cn(c?.id !== data?.[i - 1]?.id && i > 0 ? 'mt-6' : '')}
        />
      ))}
    </CardTab>
  );
};

export { ApproveChainsTab };
