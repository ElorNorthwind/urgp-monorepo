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
    <div className="chart-wrapper mx-auto flex max-w-[100rem] flex-col flex-wrap items-start justify-center gap-6  p-6 sm:flex-row sm:p-8">
      <div className="grid w-full gap-6 xl:grid-cols-[minmax(500px,_1fr)_minmax(200px,_1.5fr)]">
        <OkrugTotalsChart
          okrugs={okrugs || []}
          isLoading={isOkrugsLoading || isOkrugsFetching}
          className=""
        />
        <DoneTimelineChart
          timeline={timeline || []}
          isLoading={isTimelineLoading || isTimelineFetching}
          className=""
        />
      </div>
    </div>
  );
};
export { RenovationDashboardPage };
