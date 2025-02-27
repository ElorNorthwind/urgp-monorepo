import {
  getRouteApi,
  useLocation,
  useNavigate,
  useRouter,
  useSearch,
} from '@tanstack/react-router';
import {
  CaseCardFooter,
  StagesHeader,
  StagesList,
  useCaseById,
  useOperations,
} from '@urgp/client/entities';
import { cn, ScrollArea, Skeleton } from '@urgp/client/shared';
import {
  CaseInfoTab,
  CaseNotesTab,
  ConnectedCasesTab,
  DispatchesTab,
  ExternalCasesTab,
} from '@urgp/client/widgets';
import { CaseFull, OperationClasses } from '@urgp/shared/entities';
import { SingleCasePageHeader } from './SingleCasePageHeader';

const SingleCasePage = (): JSX.Element => {
  const pathname = useLocation().pathname;
  const caseId = getRouteApi(pathname)?.useSearch()?.id || 0;
  const {
    data: controlCase,
    isLoading,
    isFetching,
  } = useCaseById(caseId, {
    skip: !caseId || caseId === 0,
  });

  const {
    data: stages,
    isLoading: isStageLoading,
    isFetching: isStageFetching,
  } = useOperations(
    { class: OperationClasses.stage, case: controlCase?.id || 0 },
    { skip: !controlCase?.id || controlCase?.id === 0 },
  );

  if (!controlCase || isLoading || isFetching)
    return <Skeleton className="h-10 w-full" />;

  return (
    <ScrollArea
      className={cn(
        'bg-muted-foreground/5 flex h-screen min-h-screen flex-1 flex-col overflow-auto',
      )}
    >
      <div className="block space-y-6 p-10 pb-16">
        <div className="mx-auto max-w-7xl">
          <SingleCasePageHeader controlCase={controlCase} />
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <div className="flex flex-1 flex-col gap-6">
              <CaseInfoTab controlCase={controlCase} label="Карточка дела" />
              <ExternalCasesTab controlCase={controlCase} />
              <CaseNotesTab controlCase={controlCase} />
              <ConnectedCasesTab controlCase={controlCase} />
              <DispatchesTab controlCase={controlCase} />
            </div>
            <div className="lg:bg-muted-foreground/5 flex flex-col gap-2 lg:rounded-lg lg:p-2">
              <StagesHeader
                caseId={controlCase?.id}
                className="text-lg font-semibold"
              />
              <StagesList
                stages={stages}
                isLoading={isStageLoading || isStageFetching}
                controlLevel={controlCase?.controlLevel || 0}
              />
            </div>
          </div>
          <CaseCardFooter controlCase={controlCase} className="mt-6" />
        </div>
      </div>
    </ScrollArea>
  );
};

export { SingleCasePage };
