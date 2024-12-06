import { controlCasesColumns, useCases } from '@urgp/client/entities';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
  NAVBAR_WIDTH,
  SidebarInset,
  TooltipProvider,
  useIsMobile,
  VirtualDataTable,
} from '@urgp/client/shared';
import { CasesPageSearchDto, CaseWithStatus } from '@urgp/shared/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { CaseFilterSidebar, ControlSidePanel } from '@urgp/client/widgets';
import { CaseCardHeader } from './CaseCardHeader';
import { format } from 'date-fns';
import {
  caseStatusStyles,
  caseTypeStyles,
  externalSystemStyles,
} from '../../config/caseStyles';
import { ExternalCasesList } from '../ExternalCasesList';
import { CaseDirectionsList } from '../CaseDirectionsList';

type CaseCardProps = {
  className?: string;
  controlCase: CaseWithStatus;
};

const CaseCard = (props: CaseCardProps): JSX.Element => {
  //   const { data: cases, isLoading, isFetching } = useCases();
  //   const isMobile = useIsMobile();
  //   const navigate = useNavigate({ from: '/control' });
  //   const search = getRouteApi('/control').useSearch() as CasesPageSearchDto;
  const { className, controlCase } = props;
  const { icon: TypeIcon, iconStyle: typeIconStyle } =
    caseTypeStyles[controlCase?.payload?.type?.id || 1];
  const { icon: StatusIcon, iconStyle: statusIconStyle } =
    caseStatusStyles[controlCase?.status.id || 1];

  return (
    <>
      <CaseCardHeader controlCase={controlCase} />
      <Accordion
        type="multiple"
        className="w-full px-4"
        defaultValue={['classification', 'description']}
      >
        <AccordionItem value="classification">
          <AccordionTrigger>Сведения о заявке</AccordionTrigger>
          {controlCase && (
            <AccordionContent className="flex flex-col gap-2">
              <div className="bg-background grid grid-cols-[auto_1fr_auto_1fr] rounded-lg border">
                <div className="bg-muted-foreground/5 border-b border-r px-2 py-1 text-right font-bold">
                  Тип:
                </div>
                <div className="flex items-start justify-center gap-2 truncate border-b p-1">
                  {TypeIcon && (
                    <TypeIcon className={cn('-mr-1 size-5', typeIconStyle)} />
                  )}
                  <p>{controlCase.payload.type.name}</p>
                </div>
                <div className="bg-muted-foreground/5 border-x border-b px-2 py-1 text-right font-bold">
                  Статус:
                </div>
                <div className="flex items-start justify-center gap-2 truncate border-b p-1">
                  {StatusIcon && (
                    <StatusIcon
                      className={cn('-mr-1 size-5', statusIconStyle)}
                    />
                  )}
                  <p>{controlCase.status.name}</p>
                </div>
                <div className="bg-muted-foreground/5 truncate border-r px-2 py-1 text-right font-bold">
                  Тема:
                </div>
                <CaseDirectionsList
                  directions={controlCase.payload.directions}
                  className="col-span-3 p-1"
                />
              </div>
              <ExternalCasesList
                externalCases={controlCase.payload.externalCases}
              />
            </AccordionContent>
          )}
        </AccordionItem>
        <AccordionItem value="description">
          <AccordionTrigger>Описание проблемы</AccordionTrigger>
          {controlCase && (
            <AccordionContent className="bg-background rounded-t-lg border border-b-0 p-2">
              {controlCase.payload.description}
            </AccordionContent>
          )}
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Поручения</AccordionTrigger>
          <AccordionContent>Лукьянов М.Г.: 31.12.2024</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export { CaseCard };
