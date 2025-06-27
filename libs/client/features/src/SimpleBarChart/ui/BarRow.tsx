import { cn, Skeleton } from '@urgp/client/shared';
import { forwardRef, useMemo } from 'react';

type BarRowProps = {
  label?: string | JSX.Element;
  value: number;
  max: number;
  labelFit?: 'bar' | 'full';
  className?: string;
  barClassName?: string;
  isLoading?: boolean;
  onClick?: () => void;
};

const BarRow = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & BarRowProps
>(
  (
    {
      label,
      value,
      max,
      labelFit = 'bar',
      className,
      isLoading = false,
      barClassName,
      onClick,
    }: BarRowProps,
    ref,
  ): JSX.Element => {
    const filled = useMemo(
      () => (max === 0 ? 0 : Math.round((value / max) * 100)),
      [value, max],
    );
    // const filledPart = useMemo(() => value / max, [value, max]);
    if (isLoading)
      return (
        <Skeleton
          className={cn(
            'text-muted-foreground flex h-8 w-full select-none items-center justify-center rounded',
            className,
          )}
        >
          {label}
        </Skeleton>
      );
    return (
      <div
        ref={ref}
        className={cn(
          'group/bar relative h-8 w-full overflow-hidden rounded',
          onClick && 'hover:bg-muted-foreground/5 cursor-pointer',
          className,
        )}
        onClick={onClick}
      >
        <div
          style={{ width: `${filled}%` }}
          className={cn(
            'bg-foreground h-full rounded',
            'transition-all duration-1000 ease-in',
            onClick && 'group-hover/bar:bg-opacity-80',
            'flex flex-row flex-nowrap items-center justify-start gap-2 overflow-hidden truncate',
            barClassName,
          )}
        >
          {labelFit === 'bar' &&
            (label && typeof label === 'object' ? (
              label
            ) : (
              <div className="mx-2 w-full truncate whitespace-nowrap text-nowrap text-sm">
                {label}
              </div>
            ))}
        </div>
        {labelFit === 'full' && (
          <div className="absolute inset-0 flex flex-row flex-nowrap items-center justify-start gap-2 overflow-hidden truncate px-2">
            {label && typeof label === 'object' ? (
              label
            ) : (
              <div className="w-full truncate whitespace-nowrap text-nowrap text-sm">
                {label}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

export { BarRow };
