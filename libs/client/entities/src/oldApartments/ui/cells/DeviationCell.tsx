import { CellContext } from '@tanstack/react-table';
import { Badge, cn } from '@urgp/client/shared';
import { OldAppartment } from '@urgp/shared/entities';
import {
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  CircleEllipsis,
  CircleX,
} from 'lucide-react';
import { useMemo } from 'react';

function DeviationCell(props: CellContext<OldAppartment, string>): JSX.Element {
  const apartment = props.row.original;
  const problemBadgeStyles = useMemo(
    () => ({
      МФР: cn('bg-violet-100 border-violet-200'),
      Отказ: cn('bg-amber-100 border-amber-200'),
      Суды: cn('bg-rose-100 border-rose-200'),
      Проблемная: cn('bg-slate-100 border-slate-200'),
    }),
    [],
  );

  const icon = useMemo(() => {
    if (apartment.classificator.stage === 'В работе МФР') {
      return <CircleDollarSign className="h-8 w-8 text-violet-500" />;
    } else if (apartment.classificator.deviation === 'Риск') {
      return <CircleX className="h-8 w-8 text-red-500" />;
    } else if (apartment.classificator.deviation === 'Требует внимания') {
      return <CircleAlert className="h-8 w-8 text-yellow-500" />;
    } else if (apartment.classificator.deviation === 'Работа завершена') {
      return <CircleCheck className="h-8 w-8 text-emerald-500" />;
    } else {
      return <CircleEllipsis className="h-8 w-8 text-sky-500" />;
    }
  }, [apartment]);

  return (
    <div className="relative flex w-full flex-row items-center justify-start gap-2">
      {apartment.messagesCount > 0 && (
        <Badge className="border-background pointer-events-none absolute -top-1 -left-1 flex h-5 w-5 select-none place-content-center truncate px-1 text-xs font-light">
          {apartment.messagesCount}
        </Badge>
      )}
      {icon}
      <div className="flex flex-1 flex-col items-start justify-start truncate">
        <div className="flex items-center gap-1 truncate">
          {`${apartment.classificator.deviation}`}
        </div>
        <div className="text-muted-foreground truncate text-xs">
          {apartment.classificator.problems.length > 0 ? (
            apartment.classificator.problems.map((problem) => (
              <Badge
                key={problem}
                variant="outline"
                className={cn(
                  'ml-1 h-4 px-1 text-xs',
                  problemBadgeStyles?.[
                    problem as keyof typeof problemBadgeStyles
                  ],
                )}
              >
                {problem === 'Проблемная'
                  ? apartment.status === 'федеральная собственность'
                    ? 'Федеральная'
                    : apartment.status.slice(0, 1).toLocaleUpperCase() +
                      apartment.status.slice(1)
                  : problem}
              </Badge>
            ))
          ) : (
            <span>Без осложнений</span>
          )}
        </div>
      </div>
    </div>
  );
}

export { DeviationCell };
