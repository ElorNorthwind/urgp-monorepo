import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  HStack,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { X } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useState } from 'react';
import {
  useOldApartmentDetails,
  useOldApartmentTimeline,
} from '../api/oldApartmentsApi';
import dayjs from 'dayjs';

type OldApartmentDetailsSheetProps = {
  apartmentId: number | null;
  setApartmentId: (value: number | null) => void;
  className?: string;
};
const OldApartmentDetailsSheet = ({
  apartmentId,
  setApartmentId,
  className,
}: OldApartmentDetailsSheetProps): JSX.Element => {
  const {
    data: apartmentTimeline,
    isLoading: timelineIsLoading,
    isFetching: timelineIsFetching,
  } = useOldApartmentTimeline(apartmentId || 0, { skip: !apartmentId });
  const {
    data: apartmentDetails,
    isLoading: detailsIsLoading,
    isFetching: detailsIsFetching,
  } = useOldApartmentDetails(apartmentId || 0, { skip: !apartmentId });

  return (
    <Sheet open={!!apartmentId} onOpenChange={() => setApartmentId(null)}>
      <SheetContent
        side={'right'}
        className={cn('flex h-screen flex-col', className)}
      >
        <SheetHeader>
          <SheetTitle>
            {detailsIsLoading || detailsIsFetching ? (
              <Skeleton className="h-6 w-44" />
            ) : (
              apartmentDetails?.fio
            )}
          </SheetTitle>
          <SheetDescription>
            {detailsIsLoading || detailsIsFetching ? (
              <Skeleton className="h-4 w-60" />
            ) : (
              apartmentDetails &&
              apartmentDetails?.adress +
                ' кв. ' +
                apartmentDetails?.num +
                ` (${apartmentDetails?.type})`
            )}
          </SheetDescription>
        </SheetHeader>

        {/* <div className="text-muted-foreground">
          {detailsIsLoading || detailsIsFetching ? (
            <>
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-4 w-44" />
            </>
          ) : (
            apartmentDetails && (
              <div className="text-rose-500">
                {apartmentDetails?.classificator.stage +
                  ' c ' +
                  dayjs(apartmentDetails?.classificator.stageDate).format(
                    'DD.MM.YYYY',
                  )}
              </div>
            )
          )}
        </div> */}
        <h2 className="text-muted-foreground text-xl font-bold">
          {apartmentTimeline && apartmentTimeline?.length > 0
            ? 'История работы с делом'
            : 'Работа не проводилась'}
        </h2>
        {timelineIsLoading || timelineIsFetching ? (
          <>
            <Skeleton className="h-8 w-full" />
            <Skeleton className=" h-6 w-44" />
            <Skeleton className="mt-[-.8rem] h-4 w-full " />
            <Skeleton className="mt-[-.8rem] h-4 w-36 " />
          </>
        ) : (
          <ScrollArea className="-mr-4 -ml-3 flex-1 overflow-y-scroll pl-2">
            {apartmentTimeline &&
              apartmentTimeline.map((operation) => (
                <div
                  className={cn(
                    'flex w-full flex-col border-l-2  pb-8',
                    operation.source.includes('Судебная')
                      ? 'border-rose-500'
                      : 'border-cyan-500',
                  )}
                  key={operation.npp}
                >
                  <div className="flex-rows items-between  text-muted-foreground flex w-full items-center gap-2 bg-slate-50 px-4">
                    <div
                      className={cn(
                        'relative flex-1 font-bold',
                        "before:absolute before:top-[.25rem] before:left-[-1.55rem] before:my-auto before:h-4 before:w-4 before:rounded-full before:border-2 before:border-white before:content-['']",
                        operation.source.includes('Судебная')
                          ? 'before:bg-rose-500'
                          : 'before:bg-cyan-500',
                      )}
                    >
                      {dayjs(operation.date).format('DD.MM.YYYY')}
                    </div>
                    <div className="flex truncate text-xs">
                      {operation.source}
                    </div>
                  </div>
                  <div className={'p-2 pl-4 text-lg font-bold leading-none'}>
                    {operation.type}
                  </div>
                  <div
                    className={
                      'text-muted-foreground px-4 text-sm leading-snug'
                    }
                  >
                    {operation.notes}
                  </div>
                </div>
              ))}
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
};

export { OldApartmentDetailsSheet };
