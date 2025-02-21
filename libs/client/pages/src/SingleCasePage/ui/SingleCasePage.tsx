import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import { CaseFilterSidebar, DirectionsChangeMenu } from '@urgp/client/widgets';
import { CaseClasses, CaseFull, OperationClasses } from '@urgp/shared/entities';
import { format } from 'date-fns';

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

  return (
    <ScrollArea
      className={cn(
        'bg-muted-foreground/5 flex h-screen min-h-screen flex-1 flex-col overflow-auto',
      )}
    >
      <div className="block space-y-6 p-10 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">
              {controlCase?.title}
            </h2>
            <p className="text-muted-foreground">{controlCase?.extra}</p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col items-start space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
            <div className="bg-muted-foreground/5 sticky top-8 max-w-[30rem] rounded-lg">
              <StagesHeader caseId={controlCase?.id} className="mx-4 mt-4" />
              <StagesList
                stages={stages}
                isLoading={isLoading || isFetching}
                className="m-4"
              />
            </div>
            <div className="flex-1 items-start">
              <div className="">
                {/* <CardHeader>
                  <CardTitle>{controlCase?.title}</CardTitle>
                  <CardDescription>{controlCase?.extra}</CardDescription>
                </CardHeader> */}
                {/* <CardContent className="p-0"> */}
                <div className="flex flex-col gap-2">
                  <div className="text-lg font-semibold">Статус дела</div>
                  <div className="bg-background grid grid-cols-[auto_1fr_auto_1fr] rounded-lg border">
                    <div className="bg-muted-foreground/5 border-b border-r px-2 py-1 text-right font-bold">
                      Тип:
                    </div>
                    <div className="flex items-start justify-start gap-2 border-b p-1 ">
                      {TypeIcon && (
                        <TypeIcon
                          className={cn(
                            'my-auto -mr-1 size-5 shrink-0',
                            typeIconStyle,
                          )}
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
                              <p className="font-bold">
                                {caseApproveInfo?.currentFio}
                              </p>
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
                      {i.can('update', controlCase) ? (
                        <DirectionsChangeMenu
                          controlCase={controlCase}
                          variant={'link'}
                          className="text-md text-sidebar-foreground h-8 p-0 text-right font-bold hover:no-underline"
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
                  </div>
                  {controlCase?.externalCases &&
                    controlCase?.externalCases.length > 0 && (
                      <div className="text-lg font-semibold">Заявки</div>
                    )}
                  <ExternalCasesList
                    externalCases={controlCase?.externalCases}
                  />
                  <div className="text-lg font-semibold">Описани проблемы</div>
                  <div className="bg-background rounded-lg border p-2">
                    {controlCase?.notes}
                  </div>

                  {controlCase?.class === CaseClasses.problem &&
                    controlCase?.connectionsFrom && (
                      <>
                        <div className="text-lg font-semibold">
                          Связанные происшествия
                        </div>
                        {(controlCase as CaseFull)?.connectionsFrom.map(
                          (connection) => (
                            <Button
                              className="py-0"
                              variant="link"
                              key={connection.id}
                              size="sm"
                              onClick={() => {
                                navigate({
                                  to: '/control/cases',
                                  search: {
                                    selectedCase: connection.id,
                                  },
                                });
                              }}
                            >
                              {connection.title}
                            </Button>
                          ),
                        )}
                      </>
                    )}
                  {controlCase?.class === CaseClasses.incident &&
                    controlCase?.connectionsTo && (
                      <>
                        <div className="text-lg font-semibold">
                          Системные проблемы
                        </div>
                        {controlCase?.connectionsTo.map((connection) => (
                          <Button
                            className="py-0"
                            variant="link"
                            key={connection.id}
                            size="sm"
                            onClick={() => {
                              navigate({
                                to: '/control/problems',
                                search: {
                                  selectedCase: connection.id,
                                },
                              });
                            }}
                          >
                            {connection.title}
                          </Button>
                        ))}
                      </>
                    )}
                </div>

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
      </div>
    </ScrollArea>
  );
};

export { SingleCasePage };
