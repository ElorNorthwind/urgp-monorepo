import {
  cn,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
} from '@urgp/client/shared';
import { FileText, X } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import {
  useOldApartmentDetails,
  useOldApartmentTimeline,
} from '../api/oldApartmentsApi';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { OldApartmentTimeline } from '@urgp/shared/entities';
import { MessageTab } from '../../messages';

type OldApartmentDetailsSheetProps = {
  apartmentId: number | null;
  setApartmentId: (value: number | null) => void;
  refetch?: () => void;
  className?: string;
};
const OldApartmentDetailsSheet = ({
  apartmentId,
  setApartmentId,
  refetch,
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

  const [coloredTimeline, setColoredTimeline] = useState<
    (OldApartmentTimeline & { color: string })[]
  >([]);

  useEffect(() => {
    let color = 'default';
    const recolored = apartmentTimeline?.map((item) => {
      color = item.source.includes('Судебная')
        ? 'red'
        : item.notes?.includes('Московский фонд реновации')
          ? 'violet'
          : item.type === 'Ответ по смотровому' &&
              item.notes?.toLowerCase().includes('отказ')
            ? 'yellow'
            : color;
      return {
        ...item,
        color: color,
      };
    });
    setColoredTimeline(recolored || []);
  }, [apartmentTimeline]);

  return (
    <Sheet open={!!apartmentId} onOpenChange={() => setApartmentId(null)}>
      <SheetContent
        side={'right'}
        aria-describedby={undefined}
        className={cn(
          'border-nones flex h-screen flex-col gap-1 p-0',
          className,
        )}
      >
        <SheetHeader className="bg-slate-100 p-4">
          <SheetTitle className="flex items-center justify-start gap-2">
            {detailsIsLoading || detailsIsFetching ? (
              <Skeleton className="h-6 w-44" />
            ) : (
              <>
                <p>{apartmentDetails?.fio}</p>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    'http://webrsm.mlc.gov:5222/ObjectCard?ObjId=' +
                    apartmentId +
                    '&RegisterViewId=KursKpu&isVertical=true&useMasterPage=true'
                  }
                >
                  <FileText />
                </a>
              </>
            )}
          </SheetTitle>
          {detailsIsLoading || detailsIsFetching ? (
            <Skeleton className="h-4 w-60" />
          ) : (
            <SheetDescription className="text-left">
              {apartmentDetails &&
                apartmentDetails?.adress +
                  ' кв. ' +
                  apartmentDetails?.num +
                  ` (${apartmentDetails?.type})`}
            </SheetDescription>
          )}
          <p className="bg-muted-foreground/10 truncate rounded px-2 text-center leading-snug">
            {apartmentDetails?.status}
          </p>
        </SheetHeader>
        <h2 className="text-muted-foreground px-2 text-xl font-bold">
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
          <ScrollArea className="relative w-full flex-grow overflow-y-auto overflow-x-clip pl-4 pb-2">
            {coloredTimeline &&
              coloredTimeline.map((operation) => (
                <div
                  className={cn(
                    'group flex w-full flex-col border-l-2 pb-10 last:pb-2',

                    operation.color === 'red'
                      ? 'border-red-500'
                      : operation.color === 'violet'
                        ? 'border-violet-500'
                        : operation.color === 'yellow'
                          ? 'border-orange-500'
                          : 'border-cyan-500',
                  )}
                  key={operation.type + operation.date}
                >
                  <div
                    className={
                      'truncate p-1 pl-4 text-xs font-light leading-none text-slate-400'
                    }
                  >
                    {operation.group}
                  </div>
                  <div className="flex-rows items-between text-muted-foreground flex w-full items-center gap-2 bg-slate-50 px-4">
                    <div
                      className={cn(
                        'relative flex-1 font-bold',
                        "before:absolute before:top-[.25rem] before:left-[-1.55rem] before:my-auto before:h-4 before:w-4 before:rounded-full before:border-2 before:border-white before:content-['']",

                        operation.color === 'red'
                          ? 'before:bg-red-500'
                          : operation.color === 'violet'
                            ? 'before:bg-violet-500'
                            : operation.color === 'yellow'
                              ? 'before:bg-orange-500'
                              : 'before:bg-cyan-500',
                      )}
                    >
                      {dayjs(operation.date).format('DD.MM.YYYY')}
                    </div>
                    <div className="flex truncate text-xs opacity-0 group-hover:opacity-100">
                      {operation.source}
                    </div>
                  </div>

                  <div className={'p-1 pl-4 text-lg font-bold leading-none'}>
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
        <MessageTab
          apartmentId={apartmentId || 0}
          refetchAll={refetch}
          className="absolute top-0 -left-[calc(500px+0.5rem)] w-[500px]"
        />
      </SheetContent>
    </Sheet>
  );
};

export { OldApartmentDetailsSheet };
