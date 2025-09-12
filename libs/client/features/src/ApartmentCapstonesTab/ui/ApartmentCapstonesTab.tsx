import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useOldApartmentCapstones } from '@urgp/client/entities';
import { cn, Skeleton } from '@urgp/client/shared';
import { format, isAfter } from 'date-fns';

type ApartmentCapstonesTabProps = {
  apartmentId: number;
};
const ApartmentCapstonesTab = ({
  apartmentId,
}: ApartmentCapstonesTabProps): JSX.Element => {
  const {
    data: apartmentCapstones,
    isLoading: capstonesIsLoading,
    isFetching: capstonesIsFetching,
  } = useOldApartmentCapstones(apartmentId || 0, {
    skip: !apartmentId || apartmentId === -1,
  });

  return (
    <ScrollArea className="h-full w-full overflow-y-auto pl-4">
      {capstonesIsLoading || capstonesIsFetching ? (
        <>
          <Skeleton className="h-8 w-full" />
          <Skeleton className=" h-6 w-44" />
          <Skeleton className="mt-[-.8rem] h-4 w-full " />
          <Skeleton className="mt-[-.8rem] h-4 w-36 " />
        </>
      ) : (
        apartmentCapstones &&
        apartmentCapstones.map((capstone) => {
          const color = capstone?.doneDate
            ? isAfter(capstone?.doneDate, capstone?.planDate)
              ? 'red'
              : 'green'
            : isAfter(new Date(), capstone?.planDate)
              ? 'red'
              : 'gray';
          // : capstone.planDate > (capstone?.doneDate ?? new Date())
          //   ? capstone?.doneDate
          //     ? 'green'
          //     : 'gray'
          //   : 'red';
          return (
            <div
              className={cn(
                'group flex w-full flex-col border-l-2 pb-6 last:pb-2',
                color === 'red'
                  ? 'border-red-500'
                  : color === 'green'
                    ? 'border-teal-500'
                    : 'border-slate-500',

                !capstone?.doneDate && 'opacity-50',
              )}
              key={capstone.id}
            >
              <div
                className={
                  'truncate p-1 pl-4 text-sm font-light leading-none text-slate-400'
                }
              >
                {capstone?.planDate &&
                  'Плановый срок: ' + format(capstone?.planDate, 'dd.MM.yyyy')}
              </div>
              <div className="flex-rows items-between text-muted-foreground flex w-full items-center gap-2 bg-slate-50 px-4">
                <div
                  className={cn(
                    'relative flex-1 font-bold',
                    "before:absolute before:left-[-1.55rem] before:top-[.25rem] before:my-auto before:h-4 before:w-4 before:rounded-full before:border-2 before:border-white before:content-['']",
                    color === 'red'
                      ? 'before:bg-red-500'
                      : color === 'green'
                        ? 'before:bg-teal-500'
                        : 'before:bg-slate-500',

                    color === 'red' && capstone?.doneDate && 'text-red-500',
                    color === 'green' && 'text-teal-500',
                  )}
                >
                  {capstone?.doneDate
                    ? format(capstone?.doneDate, 'dd.MM.yyyy')
                    : 'Не выполнено'}
                </div>
              </div>

              <div className={'p-1 pl-4 text-lg font-bold leading-none'}>
                {capstone.status}
              </div>
            </div>
          );
        })
      )}
    </ScrollArea>
  );
};

export { ApartmentCapstonesTab };
