import {
  cn,
  getApproveInfo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import { CaseFull } from '@urgp/shared/entities';

import { DirectionsChangeMenu } from '@urgp/client/widgets';
import { format } from 'date-fns';
import {
  CaseDirectionsList,
  caseStatusStyles,
  caseTypeStyles,
  ManageReminderButton,
} from '@urgp/client/entities';
import { CardTab } from '@urgp/client/features';

type CaseInfoTabProps = {
  controlCase?: CaseFull;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const CaseInfoTab = (props: CaseInfoTabProps): JSX.Element | null => {
  const {
    controlCase,
    className,
    label = null,
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;
  const i = useUserAbility();

  if (!controlCase) return null;

  const { icon: TypeIcon, iconStyle: typeIconStyle } =
    caseTypeStyles?.[controlCase?.type?.id] ||
    Object.entries(caseTypeStyles)[0];
  const { icon: StatusIcon, iconStyle: statusIconStyle } =
    caseStatusStyles?.[controlCase?.status?.id] ||
    Object.entries(caseStatusStyles)[0];

  const caseApproveInfo = getApproveInfo(controlCase);

  return (
    <CardTab
      label={label}
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn(
        'grid grid-cols-[auto_1fr_auto_1fr] [&>*]:px-3 [&>*]:py-1 p-0',
        contentClassName,
      )}
      accordionItemName={accordionItemName}
    >
      <div className="bg-muted-foreground/5 flex items-center justify-end border-b border-r font-bold">
        <span>Тип:</span>
      </div>
      <div className="flex items-center justify-start gap-2 border-b">
        {TypeIcon && (
          <TypeIcon className={cn('size-5 flex-shrink-0', typeIconStyle)} />
        )}
        <p className="my-auto w-full truncate text-sm">
          {controlCase?.type?.name}
        </p>
      </div>
      <div className="bg-muted-foreground/5 border-x border-b px-2 py-1 text-right font-bold">
        Статус:
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-start justify-start gap-2 truncate border-b p-1 ">
            {StatusIcon && (
              <StatusIcon
                className={cn(
                  'my-auto -mr-1 size-5 shrink-0 ',
                  statusIconStyle,
                )}
              />
            )}
            <p className="my-auto w-full truncate text-sm">
              {controlCase?.status?.name}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {caseApproveInfo?.currentFio && caseApproveInfo?.approveText && (
            <>
              <p>{caseApproveInfo.approveText + ': '}</p>
              <p className="font-bold">{caseApproveInfo?.currentFio}</p>
              {caseApproveInfo?.previousFio && (
                <>
                  <p>Перенаправил:</p>
                  <p className="font-bold">{caseApproveInfo.previousFio}</p>
                </>
              )}
            </>
          )}
          {controlCase?.lastEdit && (
            <>
              <p>Последнее действие:</p>
              <p className="font-bold">
                {format(controlCase.lastEdit, 'dd.MM.yyyy HH:mm')}
              </p>
            </>
          )}
        </TooltipContent>
      </Tooltip>
      {caseApproveInfo?.rejectNotes && (
        <div className="col-span-4 border-b bg-rose-50 px-2 py-1 text-sm">
          <span>{caseApproveInfo.rejectNotes}</span>
        </div>
      )}
      <div className="bg-muted-foreground/5 flex items-center truncate border-r px-2 py-1 text-right font-bold">
        {i.can('update', controlCase) ? (
          <DirectionsChangeMenu
            controlCase={controlCase}
            variant={'link'}
            className="text-md text-sidebar-foreground h-6 p-0 text-right font-bold hover:no-underline"
            label="Темы:"
          />
        ) : (
          <span className="">Темы:</span>
        )}
      </div>
      <CaseDirectionsList
        directions={controlCase?.directions}
        className="col-span-3 items-center p-2"
      />
    </CardTab>
  );
};

export { CaseInfoTab };
