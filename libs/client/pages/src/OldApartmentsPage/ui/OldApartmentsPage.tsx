import { oldApartmentColumns, useOldApartments } from '@urgp/client/entities';
import {
  getRouteApi,
  useElementScrollRestoration,
  useNavigate,
} from '@tanstack/react-router';
import { cn, useDebounce, VirtualDataTable } from '@urgp/client/shared';
import {
  LoadedResultCounter,
  OldApartmentDetailsSheet,
  OldApartmentFilter,
} from '@urgp/client/widgets';
import { useCallback, useState } from 'react';
import { GetOldBuldingsDto, OldApartmentSearch } from '@urgp/shared/entities';

const OldApartmentsPage = (): JSX.Element => {
  const filters = getRouteApi(
    '/renovation/oldapartments',
  ).useSearch() as OldApartmentSearch;
  const debouncedFilters = useDebounce(
    { ...filters, apartment: undefined },
    200,
  );

  const navigate = useNavigate({ from: '/renovation/oldapartments' });
  const [offset, setOffset] = useState(0);

  const {
    currentData: apartments,
    isLoading,
    isFetching,
  } = useOldApartments({
    ...(debouncedFilters as Partial<OldApartmentSearch>),
    offset,
  });

  const setFilters = useCallback(
    (value: Partial<OldApartmentSearch>) => {
      // setCurrentAddress(null);
      navigate({
        search: (prev: GetOldBuldingsDto) => ({
          ...prev,
          ...value,
        }),
      });
    },
    [navigate],
  );

  const scrollRestorationId = 'oldApartmentsScrollRestorationId';
  const scrollEntry = useElementScrollRestoration({
    id: scrollRestorationId,
  });

  return (
    <>
      <div className="flex w-full flex-row justify-start pr-2">
        <OldApartmentFilter filters={filters} setFilters={setFilters} />
        <LoadedResultCounter
          currentCount={apartments?.length}
          totalCount={apartments?.[0]?.totalCount}
          isFetching={isFetching}
          className="ml-auto"
        />
      </div>
      <div className="relative w-full">
        <VirtualDataTable
          initialOffset={scrollEntry?.scrollY}
          data-scroll-restoration-id={scrollRestorationId}
          onRowClick={(row) => {
            navigate({
              search: (prev: OldApartmentSearch) => ({
                ...prev,
                apartment:
                  filters.apartment === row.original.apartmentId
                    ? undefined
                    : row.original.apartmentId,
              }),
            });
          }}
          className={cn(
            'bg-background h-[calc(100vh-3.5rem)] transition-all ease-in-out',
            filters.apartment
              ? 'w-[calc(100%-var(--messagebar-width)-var(--detailsbar-width)-1.0rem)]'
              : 'w-[calc(100%)]',
          )}
          columns={oldApartmentColumns}
          data={apartments || []}
          isFetching={isLoading || isFetching}
          totalCount={apartments?.[0]?.totalCount ?? 0}
          callbackFn={() => setOffset(apartments?.length || 0)}
          callbackMargin={3000}
          enableMultiRowSelection={false}
        />
        {filters.apartment && (
          <OldApartmentDetailsSheet
            apartmentId={filters.apartment}
            className="right-0"
            setApartmentId={() =>
              navigate({
                search: (prev: OldApartmentSearch) => ({
                  ...prev,
                  apartment: undefined,
                }),
              })
            }
          />
        )}
      </div>
    </>
  );
};

export { OldApartmentsPage };
