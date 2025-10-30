import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { forwardRef, useMemo } from 'react';
import { BarRow } from './BarRow';
import { LucideProps } from 'lucide-react';

type SimpleBarValue = {
  key: string | number;
  value: number;
  label?: string;
  style?: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  iconStyle?: string;
};

type SimpleBarChartProps = {
  values: SimpleBarValue[];
  labelFit?: 'bar' | 'full';
  className?: string;
  barRowClassName?: string;
  barClassName?: string;
  iconClassName?: string;
  isLoading?: boolean;
  skeletonCount?: number;
  isError?: boolean;
  extraBarClass?: (val: SimpleBarValue) => string;
  onBarClick?: (key: string | number) => void;
};

const BarLabel = (props: { label: string; value: number }): JSX.Element => {
  return (
    <>
      <div className="flex-shrink truncate text-sm">{props.label}</div>
      <div className="ml-auto flex-shrink-0 text-sm font-semibold">
        {props.value}
      </div>
    </>
  );
};

const SimpleBarChart = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SimpleBarChartProps
>(
  (
    {
      values,
      labelFit,
      className,
      barRowClassName,
      barClassName,
      iconClassName,
      isLoading = false,
      isError = false,
      skeletonCount = 1,
      onBarClick,
      extraBarClass,
    }: SimpleBarChartProps,
    ref,
  ): JSX.Element => {
    const maxValue = useMemo(
      () => values.reduce((acc, cur) => (cur.value > acc ? cur.value : acc), 0),
      [values],
    );

    return (
      <div className={cn('flex flex-col gap-1', className)} ref={ref}>
        {isLoading || isError
          ? [...Array(skeletonCount).keys()].map((e) => {
              return (
                <BarRow
                  key={e + 'skeleton'}
                  value={0}
                  max={0}
                  isLoading={true}
                  className={barRowClassName}
                  label={
                    isError && e === 0 ? '... что то пошло не так ...' : ''
                  }
                />
              );
            })
          : values.map((entry) => {
              return (
                <Tooltip key={entry.key + '-tt'}>
                  <TooltipTrigger asChild>
                    <BarRow
                      key={entry.key}
                      value={entry.value}
                      max={maxValue}
                      label={
                        <>
                          {entry.icon && (
                            <entry.icon
                              className={cn(
                                'size-4 shrink-0',
                                iconClassName,
                                entry.iconStyle,
                              )}
                            />
                          )}
                          <BarLabel
                            label={entry.label || ''}
                            value={entry.value}
                          />
                        </>
                      }
                      labelFit={labelFit}
                      className={cn('group h-8', barRowClassName)}
                      barClassName={cn(
                        barClassName,
                        entry.style,
                        extraBarClass && extraBarClass(entry),
                      )}
                      onClick={() => onBarClick && onBarClick(entry.key)}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="flex flex-row items-center gap-2">
                    <span className="text-xl font-semibold">{entry.value}</span>
                    <span>{entry.label}</span>
                  </TooltipContent>
                </Tooltip>
              );
            })}
      </div>
    );
  },
);

export { SimpleBarChart };
