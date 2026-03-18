import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  Button,
  cn,
  ScrollArea,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
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
import { Monitor, PhoneCall } from 'lucide-react';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';

const VksReportPage = (): JSX.Element => {
  const pathname = useLocation().pathname;
  const search = getRouteApi(pathname).useSearch() as VksDashbordPageSearch;
  const navigate = useNavigate({ from: pathname });

  const isMobile = useIsMobile();
  const [filtered, setFiltered] = useState<Row<VksUserStats>[]>([]);

  const exportedData = useMemo(() => {
    if (filtered) {
      return filtered?.map((r) => formatVksUserStatRowForExcel(r));
    } else return [];
  }, [filtered]);

  const Icon = search.caseType === 'ГЛ' ? PhoneCall : Monitor;
  const switchTooltip =
    search.caseType === 'ГЛ' ? 'Переключить на ВКС' : 'Переключить на ГЛ';

  return (
    <ScrollArea className="bg-muted-foreground/5 h-screen w-full">
      <div className="relatve mx-auto max-w-7xl space-y-6 p-10">
        <div className="flex flex-row items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                role="button"
                variant="outline"
                className="size-14 flex-shrink-0 p-2"
                onClick={() => {
                  navigate({
                    to: pathname,
                    search: {
                      ...search,
                      caseType: search.caseType === 'ГЛ' ? undefined : 'ГЛ',
                    },
                  });
                }}
              >
                <Icon className="size-8 flex-shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>
                <TooltipArrow />
                {switchTooltip}
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
          <div className="flex-grow space-y-0.5 ">
            <div className="flex items-center justify-start gap-2">
              <h2 className="text-2xl font-bold tracking-tight">
                {search.caseType === 'ГЛ'
                  ? 'Отчёт по консультациям горячей линии'
                  : 'Отчёт по онлайн-консультациям ВКС'}
              </h2>

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
              <VksStatusChart caseType={search.caseType} />
              {!isMobile && <VksStatusList caseType={search.caseType} />}
              <ExportToExcelButton
                data={exportedData}
                size={'default'}
                className="w-full rounded-lg shadow-sm"
                fileName={`Отчёт о работе сотруднриков ${search?.caseType ?? 'ВКС'}`}
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
