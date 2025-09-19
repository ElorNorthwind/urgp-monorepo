import {
  oldApartmentColumns,
  oldApartmentsFilterFn,
  useOldApartments,
} from '@urgp/client/entities';
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
import {
  GetOldBuldingsDto,
  OldApartmentSearch,
  OldAppartment,
} from '@urgp/shared/entities';
import { Row } from '@tanstack/react-table';

const OldApartmentsPage = (): JSX.Element => {
  const filters = getRouteApi(
    '/renovation/oldapartments',
  ).useSearch() as OldApartmentSearch;
  const navigate = useNavigate({ from: '/renovation/oldapartments' });
  const { data: apartments, isLoading, isFetching } = useOldApartments();
  const [filtered, setFiltered] = useState<Row<OldAppartment>[]>([]);

  const scrollRestorationId = 'oldApartmentsScrollRestorationId';
  const scrollEntry = useElementScrollRestoration({
    id: scrollRestorationId,
  });

  return (
    <>
      <div className="flex w-full flex-row justify-start pr-2">
        <OldApartmentFilter apartments={filtered} />
        <LoadedResultCounter
          currentCount={filtered?.length}
          totalCount={apartments?.length}
          isFetching={isFetching}
          className="ml-auto"
        />
      </div>
      <div className="relative w-full">
        <VirtualDataTable
          initialOffset={scrollEntry?.scrollY}
          data-scroll-restoration-id={scrollRestorationId}
          clientSide
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
          totalCount={apartments?.length ?? 0}
          globalFilter={filters}
          setFilteredRows={setFiltered}
          globalFilterFn={oldApartmentsFilterFn}
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

export default OldApartmentsPage;
