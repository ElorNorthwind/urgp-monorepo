import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useOldApartmentTimeline } from '@urgp/client/entities';
import { cn, Skeleton } from '@urgp/client/shared';
import { OldApartmentTimeline } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

type ApartmentTimelineTabProps = {
  apartmentId: number;
};
const ApartmentTimelineTab = ({
  apartmentId,
}: ApartmentTimelineTabProps): JSX.Element => {
  const {
    data: apartmentTimeline,
    isLoading: timelineIsLoading,
    isFetching: timelineIsFetching,
  } = useOldApartmentTimeline(apartmentId || 0, {
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
                {format(operation.date, 'dd.MM.yyyy')}
              </div>
              <div className="flex truncate text-xs opacity-0 group-hover:opacity-100">
                {operation.source}
              </div>
            </div>

            <div className={'p-1 pl-4 text-lg font-bold leading-none'}>
              {operation.type}
            </div>

            <div className={'text-muted-foreground px-4 text-sm leading-snug'}>
              {operation?.notes}
            </div>
          </div>
        ))
      )}
    </ScrollArea>
  );
};

export { ApartmentTimelineTab };
