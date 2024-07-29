import {
  DoneTimelineChart,
  OkrugTotalsChart,
  useDoneTimeline,
  useOkrugTotals,
} from '@urgp/client/entities';

const RenovationDashboardPage = (): JSX.Element => {
  const {
    data: okrugs,
    isLoading: isOkrugsLoading,
    isFetching: isOkrugsFetching,
  } = useOkrugTotals();

  const {
    data: timeline,
    isLoading: isTimelineLoading,
    isFetching: isTimelineFetching,
  } = useDoneTimeline();

  return (
    <div className="chart-wrapper mx-auto flex max-w-4xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
      <div className="grid w-full gap-6 sm:grid-cols-2">
        <OkrugTotalsChart
          okrugs={okrugs || []}
          isLoading={isOkrugsLoading || isOkrugsFetching}
          className="col-span-2"
        />
        <DoneTimelineChart
          timeline={timeline || []}
          isLoading={isTimelineLoading || isTimelineFetching}
          className="col-span-2"
        />
      </div>
    </div>
  );
};
export { RenovationDashboardPage };
