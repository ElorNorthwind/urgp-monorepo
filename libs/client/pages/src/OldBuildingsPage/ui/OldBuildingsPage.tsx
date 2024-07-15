import { oldBuildingsColumns, useOldBuldings } from '@urgp/client/entities';
import { getRouteApi } from '@tanstack/react-router';
import { Card, DataTable } from '@urgp/client/shared';

const OldBuildingsPage = (): JSX.Element => {
  const { limit, page, okrug } = getRouteApi('/oldbuildings').useSearch();

  const {
    data: buildings,
    isLoading,
    isFetching,
  } = useOldBuldings({ limit, page, okrug });

  return (
    <div className=" w-full p-2">
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
