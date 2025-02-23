import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  cn,
  getApproveInfo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useAuth,
  useUserAbility,
} from '@urgp/client/shared';
import { CaseClasses, CaseFull, OperationClasses } from '@urgp/shared/entities';
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
import { useLocation, useNavigate } from '@tanstack/react-router';
import { DirectionsChangeMenu } from '@urgp/client/widgets';
import { CaseInfoTab, ConnectedCasesTab } from '@urgp/client/features';

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

  const pathname = useLocation().pathname;
  const navigate = useNavigate({ from: pathname });
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
  const i = useUserAbility();
  const dispatches = controlCase?.dispatches || [];

  return (
    <>
      <CaseCardHeader
        controlCase={controlCase}
        onClose={props.onClose}
        onPrevCase={onPrevCase}
        onNextCase={onNextCase}
      />
      <div className="flex flex-col gap-2 p-4">
        <CaseInfoTab controlCase={controlCase} />
        <ExternalCasesList externalCases={controlCase?.externalCases} />
      </div>
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
        <ConnectedCasesTab controlCase={controlCase} accordion />
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
