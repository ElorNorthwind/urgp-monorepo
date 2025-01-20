import { Badge, cn } from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { directionCategoryStyles } from '../config/caseStyles';
import { forwardRef } from 'react';

type CaseDirectionsListProps = {
  className?: string;
  variant?: 'list' | 'compact' | 'table';
  directions: Case['payload']['directions'];
  label?: string;
};

const CaseDirectionsList = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CaseDirectionsListProps
>((props: CaseDirectionsListProps, ref): JSX.Element => {
  const { className, variant = 'list', directions, label } = props;

  if (variant === 'table') {
    return (
      <div className={cn('flex flex-col gap-2', className)} ref={ref}>
        {label && <div className="mb-1 font-bold">{label}</div>}
        {directions?.map(
          (d) =>
            d?.id && (
              <div className="flex items-center justify-between" key={d.id}>
                <Badge
                  variant={'outline'}
                  className={cn(
                    d?.category &&
                      directionCategoryStyles[d.category].badgeStyle,
                    'mr-2',
                  )}
                >
                  {d.name}
                </Badge>
                <span className="text-muted-foreground ml-1 font-normal">
                  {d?.category && '(' + d.category + ')'}
                </span>
              </div>
            ),
        )}
      </div>
    );
  }

  const visibleDirections =
    variant === 'compact' ? directions.slice(0, 2) : directions;

  return (
    <div
      ref={ref}
      className={cn(
        // variant === 'compact' ? 'flex-wrap-reverse' : 'flex-wrap',
        'flex-wrap',
        'flex items-start justify-start gap-1',
        className,
      )}
    >
      {label && <div className="font-bold">{label}</div>}
      {visibleDirections?.map(
        (d) =>
          d?.id && (
            <Badge
              variant={'outline'}
              className={cn(
                'text-nowrap',
                d?.category && directionCategoryStyles[d.category].badgeStyle,
              )}
              key={d?.id}
            >
              {variant === 'compact' && directions?.length > 2
                ? directions.filter((dir) => dir.category === d.category).length
                : d?.name && d.name}
            </Badge>
          ),
      )}
      {/* {variant === 'compact' && directions?.length > 2 && (
        <Badge variant={'outline'} className="flex-shrink p-1 px-3">
          ...
        </Badge>
      )} */}
    </div>
  );
});

export { CaseDirectionsList };
