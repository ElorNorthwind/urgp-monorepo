import { DashboardNumberCard, ResetCacheButton } from '@urgp/client/features';
import {
  Card,
  CardContent,
  CardHeader,
  cn,
  Separator,
} from '@urgp/client/shared';
import {
  CurrentYearSankeyChart,
  DoneByYearChart,
  InProgressAgesChart,
  MonthlyDoneTimelineChart,
  MonthlyProgressTimelineChart,
  OkrugTotalDeviationsChart,
  OkrugTotalsChart,
  StartAndFinishTimelineChart,
  StartTimelineChart,
} from '@urgp/client/widgets';
import { formatDate } from 'date-fns';
import {
  CircleAlert,
  CircleCheck,
  CircleEllipsis,
  CirclePause,
  CircleX,
} from 'lucide-react';
import { TotalNumberCards } from './cards/TotalNumberCards';

const ControlDashboardPage = (): JSX.Element => {
  return (
    <div className="bg-muted-foreground/5 block w-full space-y-6 p-10">
      <div className="space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl font-bold tracking-tight">Дашборд</h2>
        </div>
        <p className="text-muted-foreground">
          Общие сведения о выявленных проблемах
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        {/* <div className="grid w-full grid-cols-3 gap-6 lg:grid-cols-5"> */}
        <TotalNumberCards />
        {/* </div> */}
      </div>
    </div>
  );
};
export { ControlDashboardPage };
