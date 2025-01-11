import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { CaseCardHeader } from './CaseCardHeader';
import { caseStatusStyles, caseTypeStyles } from '../../config/caseStyles';
import { ExternalCasesList } from '../ExternalCasesList';
import { CaseDirectionsList } from '../CaseDirectionsList';
import {
  StagesHeader,
  StagesList,
  useDispatches,
  useStages,
} from '../../../operations';
import { CaseCardFooter } from './CaseCardFooter';
import {
  CreateDispatchDialog,
  CreateReminderDialog,
} from '@urgp/client/widgets';
import { ControlDispatchesList } from '../ControlDispatchesList';

type CaseCardProps = {
  controlCase: Case;
  onPrevCase?: () => void;
  onNextCase?: () => void;
  onClose?: () => void;
};

const CaseCard = (props: CaseCardProps): JSX.Element => {
  const { controlCase, onNextCase, onPrevCase } = props;
  const { icon: TypeIcon, iconStyle: typeIconStyle } = caseTypeStyles[
    controlCase?.payload?.type?.id || 1
  ] || {
    icon: null,
    iconStyle: '',
  };
  const { icon: StatusIcon, iconStyle: statusIconStyle } = caseStatusStyles?.[
    controlCase?.status.id || 1
  ] || {
    icon: null,
    iconStyle: '',
  };

  const {
    data: stages,
    isLoading,
    isFetching,
  } = useStages(controlCase?.id, { skip: !controlCase?.id });

  const {
    data: dispatches,
    isLoading: isDispatchesLoading,
    isFetching: isDispatchesFetching,
  } = useDispatches(controlCase?.id, { skip: !controlCase?.id });

  const i = useUserAbility();

  return (
    <>
      <CaseCardHeader
        controlCase={controlCase}
        onClose={props.onClose}
        onPrevCase={onPrevCase}
        onNextCase={onNextCase}
      />
      {controlCase && (
        <div className="flex flex-col gap-2 p-4">
          <div className="bg-background grid grid-cols-[auto_1fr_auto_1fr] rounded-lg border">
            <div className="bg-muted-foreground/5 border-b border-r px-2 py-1 text-right font-bold">
              Тип:
            </div>
            <div className="flex items-start justify-start gap-2 border-b p-1 ">
              {TypeIcon && (
                <TypeIcon
                  className={cn('my-auto -mr-1 size-5 shrink-0', typeIconStyle)}
                />
              )}
              <p className="my-auto w-full truncate text-sm">
                {controlCase.payload.type.name}
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
                    {controlCase.status.name}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {controlCase?.payload?.approver?.fio && (
                  <>
                    <p>
                      {controlCase?.payload?.approveStatus === 'pending'
                        ? 'На утверждении: '
                        : 'Согласовано: '}
                    </p>
                    <p className="font-bold">
                      {controlCase.payload.approver.fio}
                    </p>
                  </>
                )}
              </TooltipContent>
            </Tooltip>
            <div className="bg-muted-foreground/5 truncate border-r px-2 py-1 text-right font-bold">
              Тема:
            </div>
            <CaseDirectionsList
              directions={controlCase.payload.directions}
              className="col-span-3 items-center p-2"
            />
          </div>
          <ExternalCasesList
            externalCases={controlCase.payload.externalCases}
          />
        </div>
      )}
      <Accordion
        type="multiple"
        className="w-full px-4"
        defaultValue={['description']}
      >
        <AccordionItem value="description" className="relative">
          <AccordionTrigger>Описание проблемы</AccordionTrigger>
          <CreateReminderDialog
            className="absolute right-6 top-3 h-8 px-2 py-1"
            caseId={controlCase?.id}
            expectedDueDate={controlCase?.dispatches?.[0]?.dueDate || null}
          />
          {controlCase && (
            <AccordionContent className="bg-background rounded-t-lg border border-b-0 p-2">
              {controlCase.payload.description}
            </AccordionContent>
          )}
        </AccordionItem>
        <AccordionItem value="dispatches" className="relative">
          <AccordionTrigger>Поручения</AccordionTrigger>
          {i.can('create', 'Dispatch') && (
            <CreateDispatchDialog
              caseId={controlCase?.id}
              className="absolute right-6 top-3 h-8 px-2 py-1"
              displayedElement={
                <div>
                  <CaseCardHeader
                    controlCase={controlCase}
                    className="rounded-t"
                  />
                  <div className="bg-sidebar/80 max-h-50 overflow-hidden rounded-b border-t p-4">
                    {controlCase?.payload?.description}
                  </div>
                </div>
              }
            />
          )}
          <AccordionContent>
            <ControlDispatchesList
              dispatches={dispatches}
              isLoading={isDispatchesLoading || isDispatchesFetching}
              className="-mb-4 rounded-b-none border-b-0"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <StagesHeader caseId={controlCase?.id} className="mx-4 mt-4" />
      <StagesList
        stages={stages}
        isLoading={isLoading || isFetching}
        className="m-4"
      />
      <CaseCardFooter controlCase={controlCase} />
    </>
  );
};

export { CaseCard };
