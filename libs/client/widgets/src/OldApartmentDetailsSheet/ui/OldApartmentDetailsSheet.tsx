import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
} from '@urgp/client/shared';
import { ChevronRight, FileText } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { OldApartmentTimeline } from '@urgp/shared/entities';
import {
  MessageTab,
  useOldApartmentDetails,
  useOldApartmentTimeline,
} from '@urgp/client/entities';

type OldApartmentDetailsSheetProps = {
  apartmentId?: number;
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
  } = useOldApartmentTimeline(apartmentId || 0, {
    skip: !apartmentId || apartmentId === -1,
  });
  const {
    data: apartmentDetails,
    isLoading: detailsIsLoading,
    isFetching: detailsIsFetching,
  } = useOldApartmentDetails(apartmentId || 0, {
    skip: !apartmentId || apartmentId === -1,
  });

  const [coloredTimeline, setColoredTimeline] = useState<
    (OldApartmentTimeline & { color: string })[]
  >([]);

  useEffect(() => {
    let color = 'default';
    const recolored = apartmentTimeline?.map((item) => {
      color = item.source.includes('Судебная')
        ? 'red'
        : item?.notes?.includes('Московский фонд реновации')
          ? 'violet'
          : item.type === 'Ответ по смотровому' &&
              item?.notes?.toLowerCase().includes('отказ')
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
    <Card
      className={cn(
        'w-detailsbar absolute bottom-0 top-0',
        'transition-all ease-in-out',
        apartmentId && apartmentId !== -1 ? 'w-detailsbar' : 'hidden w-0',
        className,
      )}
    >
      {
        <Button
          variant="link"
          className="group absolute right-2 top-2 rounded-full p-2"
          onClick={() => setApartmentId(null)}
        >
          <ChevronRight className="stroke-muted-foreground opacity-50 group-hover:opacity-100" />
        </Button>
      }
      <CardHeader className="rounded-t-lg bg-slate-100 p-4">
        <CardTitle className="flex items-center justify-start gap-2">
          {detailsIsLoading || detailsIsFetching ? (
            <Skeleton className="h-6 w-44" />
          ) : (
            <>
              <p className="max-w-[calc(var(--detailsbar-width)-6rem)] truncate">
                {apartmentDetails?.fio}
              </p>
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
        </CardTitle>
        {detailsIsLoading || detailsIsFetching ? (
          <Skeleton className="h-4 w-60" />
        ) : (
          <CardDescription className="text-left">
            {apartmentDetails &&
              apartmentDetails?.adress +
                ' кв. ' +
                apartmentDetails?.num +
                ` (${apartmentDetails?.type})`}
          </CardDescription>
        )}
        <p className="bg-muted-foreground/10 truncate rounded px-2 text-center leading-snug">
          {apartmentDetails?.status}
        </p>
      </CardHeader>
      <CardContent
        className={cn(
          'flex h-[calc(100%-7.5rem)] w-full flex-col gap-1 border-none p-0',
          className,
        )}
      >
        <ScrollArea className="h-full w-full overflow-y-auto pl-4">
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
            coloredTimeline &&
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
                key={operation.npp}
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
                      "before:absolute before:left-[-1.55rem] before:top-[.25rem] before:my-auto before:h-4 before:w-4 before:rounded-full before:border-2 before:border-white before:content-['']",

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
                  className={'text-muted-foreground px-4 text-sm leading-snug'}
                >
                  {operation?.notes}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
        <MessageTab
          apartmentId={apartmentId || 0}
          refetchAll={refetch}
          className="w-messagebar absolute bottom-0 right-[calc(var(--detailsbar-width)+0.5rem)] top-0 max-w-[calc(100vw-var(--detailsbar-width)-var(--messagebar-width)-4rem)]"
        />
      </CardContent>
    </Card>
  );
};

export { OldApartmentDetailsSheet };
