import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
  guestUser,
  selectCurrentUser,
  useUserAbility,
} from '@urgp/client/shared';
import { Case, defineControlAbilityFor } from '@urgp/shared/entities';
import { CaseCardHeader } from './CaseCardHeader';
import { caseStatusStyles, caseTypeStyles } from '../../config/caseStyles';
import { ExternalCasesList } from '../ExternalCasesList';
import { CaseDirectionsList } from '../CaseDirectionsList';
import { StagesHeader, StagesList, useStages } from '../../../operations';
import { CaseCardFooter } from './CaseCardFooter';
import { useSelector } from 'react-redux';

type CaseCardProps = {
  className?: string;
  controlCase: Case;
  onClose?: () => void;
};

const CaseCard = (props: CaseCardProps): JSX.Element => {
  const { className, controlCase } = props;
  const { icon: TypeIcon, iconStyle: typeIconStyle } =
    caseTypeStyles[controlCase?.payload?.type?.id || 1];
  const { icon: StatusIcon, iconStyle: statusIconStyle } =
    caseStatusStyles[controlCase?.status.id || 1];
  const {
    data: stages,
    isLoading,
    isFetching,
  } = useStages(controlCase?.id, { skip: !controlCase?.id });

  const i = useUserAbility();

  return (
    <>
      <CaseCardHeader controlCase={controlCase} onClose={props.onClose} />
      {controlCase && (
        <div className="pb-0f flex flex-col gap-2 p-4">
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
        <AccordionItem value="description">
          <AccordionTrigger>Описание проблемы</AccordionTrigger>
          {controlCase && (
            <AccordionContent className="bg-background rounded-t-lg border border-b-0 p-2">
              {controlCase.payload.description}
            </AccordionContent>
          )}
        </AccordionItem>
        <AccordionItem value="dispatches">
          <AccordionTrigger>Поручения</AccordionTrigger>
          <AccordionContent>Лукьянов М.Г.: 31.12.2024</AccordionContent>
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
