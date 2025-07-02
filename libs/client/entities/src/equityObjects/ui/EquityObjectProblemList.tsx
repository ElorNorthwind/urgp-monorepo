import {
  Badge,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { EquityObject } from '@urgp/shared/entities';
import { forwardRef } from 'react';
import { equityProblemsStyles } from '../../equityClassificators';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';

type EquityObjectProblemListProps = {
  className?: string;
  variant?: 'full' | 'compact';
  label?: string;
  problems: EquityObject['problems'];
};

const EquityObjectProblemList = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & EquityObjectProblemListProps
>((props: EquityObjectProblemListProps, ref): JSX.Element | null => {
  const { className, variant = 'full', label, problems } = props;

  if (!problems?.length) return null;

  if (variant === 'full') {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-start justify-start gap-1',
          className,
        )}
      >
        {label && <div className="font-bold">{label}</div>}
        {problems?.map(
          (p) =>
            p && (
              <Tooltip key={'t_' + p}>
                <TooltipTrigger>
                  <Badge
                    variant={'outline'}
                    className={cn(
                      'truncate whitespace-nowrap text-nowrap',
                      equityProblemsStyles[p]?.badgeStyle,
                    )}
                    key={p}
                  >
                    {equityProblemsStyles[p]?.label || '-'}
                  </Badge>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent side="bottom">
                    <TooltipArrow />
                    <span>{equityProblemsStyles[p]?.fullLabel || '-'}</span>
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            ),
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        // 'pointer-events-none',
        'flex flex-wrap items-start justify-start gap-1',
        className,
      )}
    >
      {label && <div className="font-bold">{label}</div>}
      {problems.length > 2 ? (
        <Badge
          variant={'outline'}
          className={cn(
            'whitespace-nowrap text-nowrap',
            equityProblemsStyles[1].badgeStyle,
          )}
          key={'problems-more'}
        >
          {problems.length + ' пробл.'}
        </Badge>
      ) : (
        problems?.map(
          (p) =>
            p && (
              <Tooltip key={'t_' + p}>
                <TooltipTrigger>
                  <Badge
                    variant={'outline'}
                    className={cn(
                      'whitespace-nowrap text-nowrap',
                      equityProblemsStyles[p]?.badgeStyle,
                    )}
                    key={p}
                  >
                    {equityProblemsStyles[p]?.label || '-'}
                  </Badge>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent side="bottom">
                    <TooltipArrow />
                    <span>{equityProblemsStyles[p]?.fullLabel || '-'}</span>
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            ),
        )
      )}
    </div>
  );
});

export { EquityObjectProblemList };
