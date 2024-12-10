import { Badge, cn } from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { format } from 'date-fns';
import {
  directionCategoryStyles,
  externalSystemStyles,
} from '../config/caseStyles';

type CaseDirectionsListProps = {
  className?: string;
  variant?: 'list' | 'compact' | 'table';
  directions: Case['payload']['directions'];
  label?: string;
};

const CaseDirectionsList = (props: CaseDirectionsListProps): JSX.Element => {
  const { className, variant = 'list', directions, label } = props;

  if (variant === 'table') {
    return (
      <div className={cn('flex flex-col gap-1', className)}>
        {label && <div className="mb-1 font-bold">{label}</div>}
        {directions?.map((d) => (
          <div className="flex justify-between" key={d.id}>
            <Badge
              variant={'outline'}
              className={cn(
                'px-1 py-0',
                d.category && directionCategoryStyles[d.category].badgeStyle,
              )}
            >
              {d.name}
            </Badge>
            <span className="text-muted-foreground ml-1 text-xs font-normal">
              {'(' + d.category + ')'}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const visibleDirections =
    variant === 'compact' ? directions.slice(0, 2) : directions;

  return (
    <div
      className={cn(
        variant === 'compact' ? 'truncate' : 'flex-wrap',
        'flex items-start justify-start gap-1',
        className,
      )}
    >
      {label && <div className="font-bold">{label}</div>}
      {visibleDirections.map((d) => (
        <Badge
          variant={'outline'}
          className={cn(
            'text-nowrap px-1 py-0',
            d.category && directionCategoryStyles[d.category].badgeStyle,
          )}
          key={d.id}
        >
          {d.name}
        </Badge>
      ))}
      {variant === 'compact' && directions?.length > 2 && (
        <Badge variant={'outline'} className="px-1">
          ...
        </Badge>
      )}
    </div>
  );
};

export { CaseDirectionsList };
