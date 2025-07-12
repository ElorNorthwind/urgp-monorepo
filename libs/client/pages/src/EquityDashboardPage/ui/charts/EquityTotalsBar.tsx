import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { useNavigate } from '@tanstack/react-router';
import {
  equityObjectStatusStyles,
  equityObjectTypeStyles,
} from '@urgp/client/entities';
import {
  cn,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@urgp/client/shared';
import { EquityTotals } from '@urgp/shared/entities';
import { countByTypeAndStatuses } from '../../lib/countBy';

type EquityTotalsBarProps = {
  data?: EquityTotals[];
  isLoading?: boolean;
  className?: string;
  objectType?: number;
  action?: 'give' | 'take';
  direction?: 'left' | 'right';
  customMax?: number;
  thrashold?: number;
};

const EquityTotalsBar = ({
  data,
  isLoading,
  className,
  objectType = 1,
  action = 'give',
  direction = action === 'give' ? 'left' : 'right',
  customMax,
  thrashold = 0.2,
}: EquityTotalsBarProps): JSX.Element => {
  const navigate = useNavigate({ from: '/equity' });
  const { icon: Icon, label } = equityObjectTypeStyles[objectType];

  const giveStatuses = {
    noact: [1, 7, 8, 9, 10],
    hasact: [2],
    done: [3],
  };

  const takeStatuses = {
    done: [5],
    process: [4],
  };

  const giveChartData = [
    {
      name: 'noact',
      label: 'Акт не подписан',
      color: equityObjectStatusStyles[1].chartColor,
      value: data
        ? countByTypeAndStatuses(data, giveStatuses.noact, objectType)
        : 0,
    },
    {
      name: 'hasact',
      label: 'Акт подписан',
      color: equityObjectStatusStyles[2].chartColor,
      value: data
        ? countByTypeAndStatuses(data, giveStatuses.hasact, objectType)
        : 0,
    },
    {
      name: 'done',
      label: 'Передано дольщику',
      color: equityObjectStatusStyles[3].chartColor,
      value: data
        ? countByTypeAndStatuses(data, giveStatuses.done, objectType)
        : 0,
    },
  ];

  const takeChartData = [
    {
      name: 'process',
      label: 'Подлежит передаче',
      color: equityObjectStatusStyles[4].chartColor,
      value: data
        ? countByTypeAndStatuses(data, takeStatuses.process, objectType)
        : 0,
    },
    {
      name: 'done',
      label: 'Передано Москве',
      color: equityObjectStatusStyles[5].chartColor,
      value: data
        ? countByTypeAndStatuses(data, takeStatuses.done, objectType)
        : 0,
    },
  ];

  const chartData = action === 'give' ? giveChartData : takeChartData;
  const total = chartData.reduce((acc, cur) => acc + cur.value, 0);
  const max = customMax || total;

  return (
    <div
      className={cn(
        direction === 'left' ? 'flex flex-row-reverse' : 'flex-row',
        'flex h-10 items-center justify-start gap-2',
        className,
        total === 0 && 'text-muted-foreground/30',
      )}
    >
      <div
        className={cn(
          'w-16 flex-shrink-0 text-2xl',
          direction === 'left' ? 'text-left' : 'text-right',
        )}
      >
        {total.toLocaleString('ru-Ru')}
      </div>
      {Icon && <Icon className="size-6 flex-shrink-0" />}
      <div
        className={cn(
          'border-foreground flex h-full flex-grow items-center justify-end',
          direction === 'left'
            ? 'flex flex-row border-r'
            : 'flex-row-reverse border-l',
        )}
      >
        {chartData.map((item) => (
          <Tooltip key={'tooltip_' + item.name}>
            <TooltipTrigger asChild>
              <div
                key={item.name}
                className="text-background h-3/5 select-none text-center"
                style={{
                  backgroundColor: item.color,
                  width: `${(item.value / max) * 100}%`,
                }}
              >
                {item.value / max > thrashold &&
                  item.value.toLocaleString('ru-Ru')}
              </div>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent side={'top'} className="flex flex-row gap-2">
                <TooltipArrow />
                <span>{item?.label + ': ' || ''}</span>
                <span style={{ color: item.color }} className="font-bold">
                  {item?.value?.toLocaleString('ru-Ru') || ''}
                </span>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export { EquityTotalsBar };
