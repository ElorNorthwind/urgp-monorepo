import {
  getRouteApi,
  useLocation,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import {
  CaseCard,
  CaseDirectionsList,
  caseStatusStyles,
  caseTypeStyles,
  ControlDispatchesList,
  ExternalCasesList,
  StagesHeader,
  StagesList,
  useOperations,
} from '@urgp/client/entities';
import { CaseInfoTab, ConnectedCasesTab } from '@urgp/client/features';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  getApproveInfo,
  NAVBAR_WIDTH,
  ScrollArea,
  Separator,
  SidebarInset,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import { CaseFilterSidebar, DirectionsChangeMenu } from '@urgp/client/widgets';
import { CaseClasses, CaseFull, OperationClasses } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { SquareArrowLeft } from 'lucide-react';
import { SingleCasePageHeader } from './SingleCasePageHeader';

const SingleCasePage = (): JSX.Element => {
  const routeApi = getRouteApi('/control/case/$caseId');
  const controlCase: CaseFull = routeApi.useLoaderData().data;

  const { icon: TypeIcon, iconStyle: typeIconStyle } =
    caseTypeStyles[controlCase?.type?.id || 1] ||
    Object.entries(caseTypeStyles)[0];

  const { icon: StatusIcon, iconStyle: statusIconStyle } =
    caseStatusStyles?.[controlCase?.status?.id || 1] ||
    Object.entries(caseStatusStyles)[0];

  const caseApproveInfo = getApproveInfo(controlCase);

  const i = useUserAbility();

  const {
    data: stages,
    isLoading,
    isFetching,
  } = useOperations(
    { class: OperationClasses.stage, case: controlCase?.id },
    { skip: !controlCase?.id || controlCase?.id === 0 },
  );

  const pathname = useLocation().pathname;
  const navigate = useNavigate({ from: pathname });
  const router = useRouter();

  if (!controlCase) return <Skeleton className="h-10 w-full" />;

  return (
    <ScrollArea
      className={cn(
        'bg-muted-foreground/5 flex h-screen min-h-screen flex-1 flex-col overflow-auto',
      )}
    >
      <div className="block space-y-6 p-10 pb-16">
        <div className="mx-auto max-w-7xl">
          <SingleCasePageHeader controlCase={controlCase} />
          <div className="flex flex-col items-start space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
            <div className="bg-muted-foreground/5 sticky top-8 max-w-[30rem] rounded-lg">
              <StagesHeader caseId={controlCase?.id} className="mx-4 mt-4" />
              <StagesList
                stages={stages}
                isLoading={isLoading || isFetching}
                className="m-4"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <CaseInfoTab controlCase={controlCase} label="Карточка дела" />
              <ExternalCasesList
                externalCases={controlCase?.externalCases}
                label="Связанные номера"
              />
              <div className="text-lg font-semibold">Описани проблемы</div>
              <div className="bg-background rounded-lg border p-2">
                {controlCase?.notes}
              </div>
              <ConnectedCasesTab controlCase={controlCase} />
              <div className="text-lg font-semibold">Поручения</div>
              <ControlDispatchesList
                dispatches={controlCase.dispatches}
                // isLoading={isDispatchesLoading || isDispatchesFetching}
                className="-mb-4 rounded-b-none border-b-0"
              />
              {/* <CardFooter className="-mx-6 flex-col items-start gap-4 border-t pt-6">
                    <h2 className="tracking-tigh text-2xl font-semibold leading-none">
                      Отслеживать на заявки по направлениям:
                    </h2>
                  </CardFooter> */}
              {/* </CardContent> */}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export { SingleCasePage };
