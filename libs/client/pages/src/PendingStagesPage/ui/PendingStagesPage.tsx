import { pendingStagesColumns, usePendingStages } from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { cn, Separator, VirtualDataTable } from '@urgp/client/shared';
import { PendingStagesPageSearch } from '@urgp/shared/entities';
import { OldApartmentDetailsSheet } from '@urgp/client/widgets';

const PendingStagesPage = (): JSX.Element => {
  const { stage } = getRouteApi('/renovation/stages').useSearch();
  // const user = useSelector(selectCurrentUser);

  const { data: stages, isLoading, isFetching, refetch } = usePendingStages();

  const navigate = useNavigate({ from: '/renovation/stages' });

  const currentApartmentId = stages?.find((s) => s.id === stage)?.apartmentId;

  return (
    <div className="block space-y-6 p-10 pb-2">
      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Этапы</h2>
        </div>
        <p className="text-muted-foreground">
          Список этапов работы, требующих утверждения
        </p>
      </div>

      <Separator className="my-6" />
      <div
        className={cn(
          'relative w-full space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0',
        )}
      >
        <VirtualDataTable
          className={cn(
            'bg-background absolute left-0 h-[calc(100vh-13rem)] flex-1 transition-all ease-in-out',
            stage
              ? 'w-[calc(100%-var(--messagebar-width)-var(--detailsbar-width)-1.0rem)]'
              : 'w-[calc(100%)]',
          )}
          columns={pendingStagesColumns}
          data={stages || []}
          isFetching={isLoading || isFetching}
          totalCount={stages?.length ?? 0}
          enableMultiRowSelection={false}
          onRowClick={(row) => {
            row.toggleSelected();
            navigate({
              search: (prev: PendingStagesPageSearch) => ({
                ...prev,
                stage: stage === row.original.id ? undefined : row.original.id,
              }),
            });
          }}
        />
        {currentApartmentId && (
          <OldApartmentDetailsSheet
            apartmentId={currentApartmentId}
            className="right-0"
            refetch={refetch}
            setApartmentId={() =>
              navigate({
                search: (prev: PendingStagesPageSearch) => ({
                  ...prev,
                  stage: undefined,
                }),
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export default PendingStagesPage;
