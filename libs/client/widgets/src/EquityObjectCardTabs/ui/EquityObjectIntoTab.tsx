import { cn, useUserAbility } from '@urgp/client/shared';
import { EquityObject } from '@urgp/shared/entities';

import {
  caseStatusStyles,
  EquityObjectProblemList,
  equityObjectStatusStyles,
} from '@urgp/client/entities';
import { CardTab } from '@urgp/client/features';
import { eu } from 'date-fns/locale';

type EquityObjectInfoTabProps = {
  equityObject?: EquityObject;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const EquityObjectInfoTab = (
  props: EquityObjectInfoTabProps,
): JSX.Element | null => {
  const {
    equityObject,
    className,
    label = null,
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;
  const i = useUserAbility();

  if (!equityObject) return null;

  const { icon: StatusIcon, iconStyle: statusIconStyle } =
    equityObjectStatusStyles?.[equityObject?.statusId || 0] ||
    Object.entries(caseStatusStyles)[0];

  return (
    <CardTab
      label={label}
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn(
        'grid grid-cols-[auto_1fr_auto_auto] [&>*]:px-3 [&>*]:py-1 p-0',
        contentClassName,
      )}
      accordionItemName={accordionItemName}
    >
      <div className="bg-muted-foreground/5 border-b border-r px-2 py-1 text-right font-bold">
        Статус:
      </div>
      <div className="flex items-start justify-start gap-2 truncate border-b p-1 ">
        {StatusIcon && (
          <StatusIcon
            className={cn('my-auto -mr-1 size-5 shrink-0 ', statusIconStyle)}
          />
        )}
        <p className="my-auto w-full truncate font-light">
          {equityObject?.statusName || '-'}
        </p>
      </div>

      <div className="bg-muted-foreground/5 border-b border-l px-2 py-1 text-right font-bold">
        Этаж:
      </div>
      <div className="flex items-start justify-start gap-2 truncate border-b border-l p-1 font-light">
        <p className="my-auto w-full truncate">{equityObject?.floor || '-'}</p>
      </div>

      <div className="bg-muted-foreground/5 border-r px-2 py-1 text-right font-bold">
        К/Н:
      </div>
      <div className="text-muted-foreground col-span-1 font-light">
        {equityObject?.cadNum || '-'}
      </div>

      <div className="bg-muted-foreground/5 border-l px-2 py-1 text-right font-bold">
        Хар-ки:
      </div>
      <div className="text-muted-foreground col-span-1 flex flex-row gap-0 border-l px-2 font-light">
        {equityObject?.rooms && (
          <p className="mr-2 border-r pr-2">{equityObject?.rooms + ' комн.'}</p>
        )}
        {equityObject?.s && <p>{equityObject?.s + ' м²'}</p>}
      </div>

      {equityObject?.problems?.length > 0 && (
        <>
          <div className="bg-muted-foreground/5 col-start-1 flex items-center truncate border-r border-t px-2 py-1 text-right font-bold">
            <span className="">Пробл.:</span>
          </div>
          <EquityObjectProblemList
            problems={equityObject?.problems}
            className="col-span-3 items-center border-t p-2"
          />
        </>
      )}
    </CardTab>
  );
};

export { EquityObjectInfoTab };
