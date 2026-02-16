import { getRouteApi, useLocation } from '@tanstack/react-router';
import { useVksUserStats } from '@urgp/client/entities';
import { cn, VirtualDataTable } from '@urgp/client/shared';
import { VksDashbordPageSearch, VksUserStats } from '@urgp/shared/entities';
import { vksUserReportColumns } from './vksUserReportColumns';
import { Dispatch, useState } from 'react';
import { ColumnSort, Row } from '@tanstack/react-table';

type TableProps = {
  className?: string;
  setFilteredRows?: Dispatch<Row<VksUserStats>[]> | undefined;
};

const VksUserReportTable = ({
  className,
  setFilteredRows,
}: TableProps): JSX.Element => {
  const pathname = useLocation().pathname;
  const search = getRouteApi(pathname).useSearch() as VksDashbordPageSearch;

  const { data, isLoading, isFetching } = useVksUserStats(search);
  const [sotring, setSorting] = useState<ColumnSort[]>([]);

  return (
    <VirtualDataTable
      autofocus
      clientSide
      className={cn(className)}
      columns={vksUserReportColumns}
      data={data || []}
      isFetching={isLoading || isFetching}
      totalCount={data?.length ?? 0}
      enableMultiRowSelection={true}
      variant="borderless"
      compact={false}
      sorting={sotring}
      setSorting={(value) => {
        setSorting(value);
      }}
      setFilteredRows={setFilteredRows}
      faceted
    />
  );
};
export default VksUserReportTable;
