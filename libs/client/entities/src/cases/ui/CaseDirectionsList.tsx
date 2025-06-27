import {
  Badge,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { Classificator } from '@urgp/shared/entities';
import { forwardRef } from 'react';
import { directionCategoryStyles } from '../config/caseStyles';

type CaseDirectionsListProps = {
  className?: string;
  variant?: 'list' | 'compact' | 'table';
  directions: Classificator[];
  label?: string;
};

const CaseDirectionsList = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CaseDirectionsListProps
>((props: CaseDirectionsListProps, ref): JSX.Element | null => {
  const { className, variant = 'list', directions, label } = props;

  if (!directions?.length) return null;

  if (variant === 'table') {
    return (
      <>
        {label && <div className="mb-2 font-bold">{label}</div>}
        <div
          className={cn(
            'pointer-events-none',
            'flex max-h-96 flex-col flex-wrap gap-2 gap-x-8',
            className,
          )}
          ref={ref}
        >
          {[...directions]
            .sort((a, b) => {
              const dif1 = (a?.category || '').localeCompare(b?.category || '');
              const dif2 = (a?.name || '').localeCompare(b?.name || '');
              return dif1 > 0
                ? 1
                : dif1 < 0
                  ? -1
                  : dif2 > 0
                    ? 1
                    : dif2 < 0
                      ? -1
                      : 0;
            })
            .map(
              (d) =>
                d?.id && (
                  <div className="flex items-center justify-between" key={d.id}>
                    <Badge
                      variant={'outline'}
                      className={cn(
                        d?.category &&
                          directionCategoryStyles[d?.category].badgeStyle,
                        'mr-2',
                      )}
                    >
                      {d?.name}
                    </Badge>
                    <span className="text-muted-foreground ml-1 font-normal">
                      {d?.category && '(' + d.category + ')'}
                    </span>
                  </div>
                ),
            )}
        </div>
      </>
    );
  }

  if (variant === 'list') {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-start justify-start gap-1',
          className,
        )}
      >
        {label && <div className="font-bold">{label}</div>}
        {directions?.map(
          (d) =>
            d?.id && (
              <Tooltip key={'t' + d?.id}>
                <TooltipTrigger>
                  <Badge
                    variant={'outline'}
                    className={cn(
                      'whitespace-nowrap text-nowrap',
                      d?.category &&
                        directionCategoryStyles[d.category].badgeStyle,
                    )}
                    key={d?.id}
                  >
                    {d?.name && d.name}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <span>{d?.fullname}</span>
                  <span className="text-muted-foreground/80 ml-2">
                    {d?.category && `(${d.category})`}
                  </span>
                </TooltipContent>
              </Tooltip>
            ),
        )}
      </div>
    );
  }

  const reducedDirectionsMap = directions.reduce((acc, cur) => {
    return acc.set(cur?.category, (acc.get(cur?.category) || 0) + 1);
  }, new Map());
  const reducedDirections = Array.from(
    reducedDirectionsMap,
    ([name, value]) => ({ name, value }),
  );

  return (
    <div
      ref={ref}
      className={cn(
        'pointer-events-none',
        'flex flex-wrap items-start justify-start gap-1',
        className,
      )}
    >
      {label && <div className="font-bold">{label}</div>}
      {directions.length > 2
        ? reducedDirections.slice(0, 3).map(
            (d) =>
              d?.name && (
                <Badge
                  variant={'outline'}
                  className={cn(
                    'whitespace-nowrap text-nowrap',
                    directionCategoryStyles[d?.name].badgeStyle,
                  )}
                  key={d?.name}
                >
                  {d.value}
                </Badge>
              ),
          )
        : directions?.map(
            (d) =>
              d?.id && (
                <Badge
                  variant={'outline'}
                  className={cn(
                    'whitespace-nowrap text-nowrap',
                    d?.category &&
                      directionCategoryStyles[d.category].badgeStyle,
                  )}
                  key={d?.id}
                >
                  {d?.name && d.name}
                </Badge>
              ),
          )}
      {directions.length > 2 && reducedDirections.length > 3 && (
        <Badge variant={'outline'} className="flex-shrink p-1 px-[0.85rem]">
          ...
        </Badge>
      )}
    </div>
  );
});

export { CaseDirectionsList };
