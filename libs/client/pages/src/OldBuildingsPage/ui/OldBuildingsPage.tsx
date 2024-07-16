import {
  oldBuildingsColumns,
  OldBuildingsFilter,
  useOldBuldings,
} from '@urgp/client/entities';
import { getRouteApi } from '@tanstack/react-router';
import { DataTable } from '@urgp/client/shared';

const OldBuildingsPage = (): JSX.Element => {
  const {
    limit,
    page,
    okrug,
    relocationType,
    status,
    dificulty,
    deviation,
    relocationAge,
    relocationStatus,
    adress,
  } = getRouteApi('/oldbuildings').useSearch();

  const {
    data: buildings,
    isLoading,
    isFetching,
  } = useOldBuldings({ limit, page, okrug });

  return (
    <div className="w-full p-2">
      <OldBuildingsFilter />
      {/* <Card className="w-full p-4"> */}
      <DataTable
        columns={oldBuildingsColumns}
        data={buildings || []}
        isLoading={isLoading || isFetching}
      />
      {/* </Card> */}
    </div>
  );
};

export { OldBuildingsPage };
