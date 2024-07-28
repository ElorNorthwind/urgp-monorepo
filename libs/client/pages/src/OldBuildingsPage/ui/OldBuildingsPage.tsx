import {
  OldBuildingsCard,
  oldBuildingsColumns,
  useOldBuldings,
} from '@urgp/client/entities';
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router';
import {
  Button,
  cn,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDebounce,
  VirtualDataTable,
} from '@urgp/client/shared';
import { LoadedResultCounter, OldBuildingsFilter } from '@urgp/client/widgets';
import { useCallback, useState } from 'react';
import { GetOldBuldingsDto, OldBuilding } from '@urgp/shared/entities';
import { Gauge, Settings, TableProperties } from 'lucide-react';
import { TooltipPortal } from '@radix-ui/react-tooltip';

const OldBuildingsPage = (): JSX.Element => {
  const filters = getRouteApi('/oldbuildings').useSearch() as GetOldBuldingsDto;
  const debouncedFilters = useDebounce(filters, 200);

  const navigate = useNavigate({ from: '/oldbuildings' });
  const [offset, setOffset] = useState(0);

  const [currentAdress, setCurrentAddress] = useState<OldBuilding | null>(null);

  const {
    currentData: buildings,
    isLoading,
    isFetching,
  } = useOldBuldings({
    ...(debouncedFilters as Partial<GetOldBuldingsDto>),
    offset,
  });

  const setFilters = useCallback(
    (value: Partial<GetOldBuldingsDto>) => {
      setCurrentAddress(null);
      navigate({
        search: (prev: GetOldBuldingsDto) => ({
          ...prev,
          ...value,
        }),
      });
    },
    [navigate],
  );

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={100}>
      <div className="bg-muted/60 flex min-h-screen w-full flex-col">
        <aside className="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col justify-between border-r p-2 sm:flex">
          <nav className="items-centergap-4 flex flex-col gap-2">
            {/* <Link to={isActive ? '/oldbuildings' : '#'}> */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="flex p-0"
                  onClick={() => navigate({ to: '#' })}
                >
                  <Gauge className="" />
                </Button>
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent side="right">Главная</TooltipContent>
              </TooltipPortal>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="flex p-0"
                  variant="ghost"
                  onClick={() => navigate({ to: '/oldbuildings' })}
                >
                  <TableProperties className="" />
                </Button>
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent side="right" className="">
                  Отселяемые дома
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
            {/* </Link> */}
          </nav>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="flex p-2"
                variant="ghost"
                disabled
                onClick={() => navigate({ to: '#' })}
              >
                <Settings className="stroke-muted-foreground/40 h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent side="right" className="">
                TBD
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </aside>
        <main className="relative flex flex-1 flex-col gap-2 p-2 sm:pl-16">
          <HStack justify={'between'} className="w-full pr-2">
            <OldBuildingsFilter filters={filters} setFilters={setFilters} />
            <LoadedResultCounter
              currentCount={buildings?.length}
              totalCount={buildings?.[0]?.totalCount}
              isFetching={isFetching}
            />
          </HStack>

          <HStack
            gap="s"
            className="h-[calc(100vh-3.5rem)] w-full overflow-hidden"
          >
            <VirtualDataTable
              // onRowDoubleClick={() => setCurrentAddress(null)}
              onRowClick={(row) => {
                row.toggleSelected();
                setCurrentAddress(
                  row?.original?.id === currentAdress?.id
                    ? null
                    : row?.original,
                );
              }}
              className={cn(
                'bg-background h-full transition-all',
                currentAdress
                  ? 'w-[calc(100%-520px-0.5rem)]'
                  : 'w-[calc(100%)]',
              )}
              columns={oldBuildingsColumns}
              data={buildings || []}
              isFetching={isLoading || isFetching}
              totalCount={buildings?.[0]?.totalCount ?? 0}
              callbackFn={() => setOffset(buildings?.length || 0)}
              callbackMargin={3000}
              enableMultiRowSelection={false}
              sorting={
                filters?.sortingKey
                  ? [
                      {
                        id: filters.sortingKey,
                        desc: filters.sortingDirection === 'desc',
                      } as { id: string; desc: boolean },
                    ]
                  : []
              }
              setSorting={(value) => {
                value && value.length > 0
                  ? setFilters({
                      sortingKey: value[0].id,
                      sortingDirection: value[0].desc ? 'desc' : 'asc',
                    })
                  : setFilters({
                      sortingKey: undefined,
                      sortingDirection: undefined,
                    });
              }}
              initialState={{
                sorting: [
                  {
                    id: 'district',
                    desc: false,
                  },
                ],
              }}
            />
            <OldBuildingsCard
              building={currentAdress}
              onClose={() => setCurrentAddress(null)}
              className="h-full"
              width={520}
            />
          </HStack>
        </main>
      </div>
    </TooltipProvider>
  );
};

export { OldBuildingsPage };
