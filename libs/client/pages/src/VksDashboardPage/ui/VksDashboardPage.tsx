import { ScrollArea, Separator } from '@urgp/client/shared';
import { Construction } from 'lucide-react';
import { VksTimelineChart } from './cards/VksTImeline';
import {
  VksCasesDateFilter,
  VksCasesResetFilter,
  VksDepartmentFilter,
} from '@urgp/client/widgets';

const VksDashboardPage = (): JSX.Element => {
  return (
    <ScrollArea className="bg-muted-foreground/5 h-screen w-full">
      <div className="relatve mx-auto max-w-7xl space-y-6 p-10">
        <div className="space-y-0.5">
          <div className="flex items-center justify-start gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Дашборд</h2>

            <VksDepartmentFilter
              className="ml-auto flex-grow-0 border-solid pl-2"
              overrideDefaultWidth
              fullBadge
              variant={'popover'}
            />
            <VksCasesDateFilter />
            <VksCasesResetFilter variant="mini" className="" />
          </div>
          <p className="text-muted-foreground">
            Общие сведения по онлайн-консультациям Департамента
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-6">
          {/* <Construction className="size-24" /> */}
          <VksTimelineChart />
        </div>
      </div>
    </ScrollArea>
  );
};
export default VksDashboardPage;
