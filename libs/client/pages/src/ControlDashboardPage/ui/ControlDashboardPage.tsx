import { cn, ScrollArea, Separator } from '@urgp/client/shared';
import { TotalNumberCards } from './cards/TotalNumberCards';
import { ViewStatusChart } from './cards/ViewStatusChart';
import { CreateCaseButton } from '@urgp/client/entities';
import { DepartmentChart } from './cards/DepartmentChart';
import { PendingActionChart } from './cards/PendingActionsChart';

const ControlDashboardPage = (): JSX.Element => {
  return (
    <ScrollArea className="bg-muted-foreground/5 h-screen w-full">
      <div className="relatve mx-auto max-w-7xl space-y-6 p-10">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Дашборд</h2>
          </div>
          <p className="text-muted-foreground">
            Общие сведения о выявленных проблемах
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-6">
          <TotalNumberCards />
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <PendingActionChart className="col-span-2" />
            <DepartmentChart className="col-span-2 md:col-span-1" />
            <div className="col-span-2 flex flex-col justify-start gap-6 md:col-span-1">
              <ViewStatusChart className="grid-col-1" />
              <CreateCaseButton
                label="Добавить новую заявку"
                className="flex-grow rounded-lg py-6 text-base shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
export { ControlDashboardPage };
