import {
  oldApartmentColumns,
  specialApartmentsGlobalFilterFn,
  useOldApartments,
  useSpecialApartments,
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
  SpecialApartmentFilter,
} from '@urgp/client/widgets';
import { useCallback, useState } from 'react';
import { OldAppartment, SpecialApartmentSearch } from '@urgp/shared/entities';
import { Row } from '@tanstack/react-table';

const SpecialApartmentsPage = (): JSX.Element => {
  const filters = getRouteApi(
    '/renovation/specialapartments',
  ).useSearch() as SpecialApartmentSearch;

  const navigate = useNavigate({ from: '/renovation/specialapartments' });

  const { data: apartments, isLoading, isFetching } = useSpecialApartments();
  const [filtered, setFiltered] = useState<Row<OldAppartment>[]>([]);

  const setFilters = useCallback(
    (value: SpecialApartmentSearch) => {
      // setCurrentAddress(null);
      navigate({
        search: (prev: SpecialApartmentSearch) => ({
          ...prev,
          apartment: undefined,
          ...value,
        }),
      });
    },
    [navigate],
  );

  const scrollRestorationId = 'specialApartmentsScrollRestorationId';
  const scrollEntry = useElementScrollRestoration({
    id: scrollRestorationId,
  });

  return (
    <>
      <div className="flex w-full flex-row justify-start pr-2">
        <SpecialApartmentFilter
          filters={filters}
          setFilters={setFilters}
          totalCount={apartments?.length}
          filteredCount={filtered?.length}
        />
      </div>
      <div className="relative w-full">
        <VirtualDataTable
          clientSide
          setFilteredRows={setFiltered}
          initialOffset={scrollEntry?.scrollY}
          data-scroll-restoration-id={scrollRestorationId}
          onRowClick={(row) => {
            navigate({
              search: (prev: SpecialApartmentSearch) => ({
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
          enableMultiRowSelection={false}
          globalFilter={filters}
          globalFilterFn={specialApartmentsGlobalFilterFn}
        />
        {filters.apartment && (
          <OldApartmentDetailsSheet
            apartmentId={filters.apartment}
            className="right-0"
            setApartmentId={() =>
              navigate({
                search: (prev: SpecialApartmentSearch) => ({
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

export default SpecialApartmentsPage;
