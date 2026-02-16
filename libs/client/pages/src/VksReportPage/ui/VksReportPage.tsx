import { getRouteApi, useLocation } from '@tanstack/react-router';
import {
  cn,
  ScrollArea,
  Separator,
  useIsMobile,
  useVksAbility,
} from '@urgp/client/shared';
import {
  VksCasesDateFilter,
  VksCasesResetFilter,
  VksDepartmentFilter,
} from '@urgp/client/widgets';
import { VksDashbordPageSearch, VksUserStats } from '@urgp/shared/entities';
import { VksStatusChart } from '../../VksDashboardPage/ui/cards/VksStatusChart';
import { VksDailySlotsChart } from '../../VksDashboardPage/ui/cards/VksDailySlotsChart';
import VksUserReportTable from './table/VksUserReportTable';
import { useMemo, useState } from 'react';
import { Row } from '@tanstack/react-table';
import { formatVksUserStatRowForExcel } from '@urgp/client/entities';
import { ExportToExcelButton } from '@urgp/client/features';
import { use } from 'passport';
import { VksStatusList } from './cards/VksStatusList';

const VksReportPage = (): JSX.Element => {
  const pathname = useLocation().pathname;
  const isMobile = useIsMobile();
  const [filtered, setFiltered] = useState<Row<VksUserStats>[]>([]);

  const exportedData = useMemo(() => {
    if (filtered) {
      return filtered?.map((r) => formatVksUserStatRowForExcel(r));
    } else return [];
  }, [filtered]);

  return (
    <ScrollArea className="bg-muted-foreground/5 h-screen w-full">
      <div className="relatve mx-auto max-w-7xl space-y-6 p-10">
        <div className="space-y-0.5">
          <div className="flex items-center justify-start gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Отчёт</h2>

            <VksDepartmentFilter
              className="ml-auto flex-grow-0 border-solid pl-2"
              overrideDefaultWidth
              fullBadge
              variant={'popover'}
            />
            <VksCasesDateFilter align="end" />
            <VksCasesResetFilter variant="mini" className="" />
          </div>
          <p className="text-muted-foreground">
            Работа сотрудников, проводивших консультации
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-6">
          {/* <Construction className="size-24" /> */}
          <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-[2fr_300px]">
            <VksUserReportTable
              className="bg-background order-2 h-[calc(100vh-11.8rem)] rounded-lg border shadow-sm lg:order-1"
              setFilteredRows={setFiltered}
            />
            <div className={cn('order-1 lg:order-2', 'flex flex-col gap-2')}>
              <VksStatusChart />
              {!isMobile && <VksStatusList />}
              <ExportToExcelButton
                data={exportedData}
                size={'default'}
                className="w-full rounded-lg shadow-sm"
                fileName="Отчёт о работе сотрудников"
                label="Экспортировать в Excel"
              />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
export default VksReportPage;
