import { ReactNode } from '@tanstack/react-router';
import {
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  cn,
} from '@urgp/client/shared';
import { ReactElement, SVGProps } from 'react';

type ReChartTooltip = {
  config: ChartConfig;
  cursor?: boolean | ReactElement | SVGProps<SVGElement>;
  labelFormatter?: (label: any, payload: any) => ReactNode;
  className?: string;
};

const renderRechartsTooltip = ({
  className,
  config,
  cursor = false,
  labelFormatter,
}: ReChartTooltip): JSX.Element => {
  return (
    <ChartTooltip
      defaultIndex={1}
      content={
        <ChartTooltipContent
          indicator="dot"
          labelFormatter={
            labelFormatter
              ? labelFormatter
              : (value) => {
                  return (
                    <div className={cn('text-lg font-bold', className)}>
                      {value}
                    </div>
                  );
                }
          }
          formatter={(value, name, item, index) => {
            return (
              <div className="w-[12rem]">
                <div className="flex w-full items-center gap-2">
                  <div
                    className="h-[.75rem] w-[.75rem] rounded"
                    style={{
                      backgroundColor: item.color,
                      opacity: value === 0 ? 0.2 : 1,
                    }}
                  />
                  <div
                    className={cn(value === 0 && 'text-muted-foreground/20')}
                  >
                    {config[name as keyof typeof config]?.label}
                  </div>
                  <div
                    className={cn(
                      'ml-auto font-bold',
                      value === 0 && 'text-muted-foreground/20',
                    )}
                  >
                    {value}
                  </div>
                </div>
                {Object.keys(config).length > 1 &&
                  index === Object.keys(config).length - 1 && (
                    <div className="text-foreground mt-1.5 flex w-full basis-full items-center border-t pt-1.5 text-xs font-medium">
                      ИТОГО
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-bold">
                        {Object.keys(config).reduce((total, key) => {
                          return total + item.payload[key];
                        }, 0)}
                      </div>
                    </div>
                  )}
              </div>
            );
          }}
        />
      }
      cursor={cursor}
    />
  );
};

export { renderRechartsTooltip };
