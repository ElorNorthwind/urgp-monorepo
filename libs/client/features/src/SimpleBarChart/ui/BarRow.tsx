import { TooltipTrigger } from '@radix-ui/react-tooltip';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Skeleton,
  Tooltip,
  TooltipContent,
} from '@urgp/client/shared';
import { useMemo } from 'react';

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

const BarRow = ({
  label,
  value,
  max,
  labelFit = 'bar',
  className,
  isLoading = false,
  barClassName,
  onClick,
}: BarRowProps): JSX.Element => {
  const filled = useMemo(() => Math.round((value / max) * 100), [value, max]);
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
          onClick && 'group-hover/bar:bg-opacity-80',
          'flex flex-row flex-nowrap items-center justify-start gap-2 overflow-hidden truncate',
          barClassName,
        )}
      >
        {labelFit === 'bar' &&
          (label && typeof label === 'object' ? (
            label
          ) : (
            <div className="mx-2 w-full truncate text-nowrap text-sm">
              {label}
            </div>
          ))}
      </div>
      {labelFit === 'full' && (
        <div className="absolute inset-0 flex flex-row flex-nowrap items-center justify-start gap-2 overflow-hidden truncate px-2">
          {label && typeof label === 'object' ? (
            label
          ) : (
            <div className="w-full truncate text-nowrap text-sm">{label}</div>
          )}
        </div>
      )}
    </div>
  );
};

export { BarRow };
