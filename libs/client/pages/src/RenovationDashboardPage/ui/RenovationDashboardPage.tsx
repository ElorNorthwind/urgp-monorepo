import { OkrugTotalsChart, useOkrugTotals } from '@urgp/client/entities';

const RenovationDashboardPage = (): JSX.Element => {
  const { data: okrugs, isLoading, isFetching } = useOkrugTotals();

  return (
    <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
      <div className="grid w-full gap-6  sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
        <OkrugTotalsChart
          okrugs={okrugs || []}
          isLoading={isLoading || isFetching}
          className="w-[50rem]"
        />
      </div>
    </div>
  );
};
export { RenovationDashboardPage };
