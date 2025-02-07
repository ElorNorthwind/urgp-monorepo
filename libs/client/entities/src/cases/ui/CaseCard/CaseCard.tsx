import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
  getApproveInfo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { CaseFull, OperationClasses } from '@urgp/shared/entities';
import { CaseCardHeader } from './CaseCardHeader';
import { caseStatusStyles, caseTypeStyles } from '../../config/caseStyles';
import { ExternalCasesList } from '../ExternalCasesList';
import { CaseDirectionsList } from '../CaseDirectionsList';
import {
  CreateDispatchButton,
  ManageReminderButton,
  StagesHeader,
  StagesList,
  useOperations,
} from '../../../operations';
import { CaseCardFooter } from './CaseCardFooter';
import { ControlDispatchesList } from '../ControlDispatchesList';
import { format } from 'date-fns';
import { CaseSmartActions } from '../CaseButtons/CaseSmartActions';

type CaseCardProps = {
  controlCase: CaseFull;
  onPrevCase?: () => void;
  onNextCase?: () => void;
  onClose?: () => void;
};

const CaseCard = (props: CaseCardProps): JSX.Element => {
  const { controlCase, onNextCase, onPrevCase } = props;
  const { icon: TypeIcon, iconStyle: typeIconStyle } =
    caseTypeStyles[controlCase?.type?.id || 1] ||
    Object.entries(caseTypeStyles)[0];
  // {
  //   icon: null,
  //   iconStyle: '',
  // };
  const { icon: StatusIcon, iconStyle: statusIconStyle } = caseStatusStyles?.[
    controlCase?.status?.id || 1
  ] || {
    icon: null,
    iconStyle: '',
  };

  const {
    data: stages,
    isLoading,
    isFetching,
  } = useOperations(
    { class: OperationClasses.stage, case: controlCase?.id },
    { skip: !controlCase?.id || controlCase?.id === 0 },
  );

  // const {
  //   data: dispatches,
  //   isLoading: isDispatchesLoading,
  //   isFetching: isDispatchesFetching,
  // } = useDispatches(controlCase?.id, { skip: !controlCase?.id });
  const dispatches = controlCase?.dispatches || [];

  const caseApproveInfo = getApproveInfo(controlCase);

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
                {caseApproveInfo?.currentFio &&
                  caseApproveInfo?.approveText && (
                    <>
                      <p>{caseApproveInfo.approveText + ': '}</p>
                      <p className="font-bold">{caseApproveInfo?.currentFio}</p>
                      {caseApproveInfo?.previousFio && (
                        <>
                          <p>Перенаправил:</p>
                          <p className="font-bold">
                            {caseApproveInfo.previousFio}
                          </p>
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
              <span className="">Темы:</span>
            </div>
            <CaseDirectionsList
              directions={controlCase?.directions}
              className="col-span-3 items-center p-2"
            />
          </div>
          <ExternalCasesList externalCases={controlCase?.externalCases} />
        </div>
      )}
      <Accordion
        type="multiple"
        className="w-full px-4"
        defaultValue={['description']}
      >
        <AccordionItem value="description" className="relative">
          <AccordionTrigger>Описание проблемы</AccordionTrigger>
          <ManageReminderButton
            caseId={controlCase?.id}
            className="absolute right-6 top-3 h-8 px-2 py-1"
            expectedDate={
              controlCase?.dispatches?.[0]?.dueDate
                ? (controlCase?.dispatches?.[0]?.dueDate as unknown as string)
                : undefined
            }
          />
          {controlCase && (
            <AccordionContent className="bg-background rounded-t-lg border border-b-0 p-2">
              {controlCase?.notes}
            </AccordionContent>
          )}
        </AccordionItem>
        <AccordionItem value="dispatches" className="relative">
          <AccordionTrigger>Поручения</AccordionTrigger>
          {controlCase?.id && (
            <CreateDispatchButton
              className="absolute right-6 top-3 h-8 px-2 py-1"
              caseId={controlCase.id}
            />
          )}
          <AccordionContent>
            <ControlDispatchesList
              dispatches={dispatches}
              // isLoading={isDispatchesLoading || isDispatchesFetching}
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
