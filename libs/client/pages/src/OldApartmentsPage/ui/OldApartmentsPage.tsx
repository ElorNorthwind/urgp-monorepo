import {
  oldApartmentColumns,
  OldApartmentDetailsSheet,
  useOldApartments,
} from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { cn, useDebounce, VirtualDataTable } from '@urgp/client/shared';
import { LoadedResultCounter, OldApartmentFilter } from '@urgp/client/widgets';
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
      <VirtualDataTable
        onRowClick={(row) => {
          // row.toggleSelected();
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
        )}
        columns={oldApartmentColumns}
        data={apartments || []}
        isFetching={isLoading || isFetching}
        totalCount={apartments?.[0]?.totalCount ?? 0}
        callbackFn={() => setOffset(apartments?.length || 0)}
        callbackMargin={3000}
        enableMultiRowSelection={false}
        // sorting={
        //   filters?.sortingKey
        //     ? [
        //         {
        //           id: filters.sortingKey,
        //           desc: filters.sortingDirection === 'desc',
        //         } as { id: string; desc: boolean },
        //       ]
        //     : []
        // }
        // setSorting={(value) => {
        //   value && value.length > 0
        //     ? setFilters({
        //         sortingKey: value[0].id,
        //         sortingDirection: value[0].desc ? 'desc' : 'asc',
        //       })
        //     : setFilters({
        //         sortingKey: undefined,
        //         sortingDirection: undefined,
        //       });
        // }}
        // initialState={{
        //   sorting: [
        //     {
        //       id: 'district',
        //       desc: false,
        //     },
        //   ],
        // }}
      />
      {/* </HStack> */}
      {filters.apartment && (
        <OldApartmentDetailsSheet
          apartmentId={filters.apartment}
          // refetch={refetch} //naa, can't do that here!
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
    </>
  );
};

export { OldApartmentsPage };
