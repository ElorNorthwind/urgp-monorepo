import { useNavigate } from '@tanstack/react-router';
import { equityObjectStatusStyles } from '@urgp/client/entities';
import { renderRechartsTooltip } from '@urgp/client/features';
import { ChartConfig, ChartContainer, cn } from '@urgp/client/shared';
import { EquityTotals } from '@urgp/shared/entities';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { countByTypeAndStatuses } from '../../lib/countBy';

type EquityTotalsGaugeProps = {
  data?: EquityTotals[];
  className?: string;
  objectType?: number;
  action?: 'give' | 'take';
  variant?: 'top' | 'bottom' | 'full';
  innerRadius?: number;
  outerRadius?: number;
  isLoading?: boolean;
};

const EquityTotalsGauge = ({
  data,
  className,
  objectType = 1,
  variant = 'full',
  action = 'give',
  innerRadius = 100,
  outerRadius = 180,
  isLoading,
}: EquityTotalsGaugeProps): JSX.Element => {
  const navigate = useNavigate({ from: '/equity' });

  const chartVariations = {
    top: {
      cy: 150,
      numberY: -24,
      textY: -4,
      endAngle: 180,
      startAngle: undefined,
      marginStyle: '-mt-8',
    },
    bottom: {
      cy: 0,
      numberY: 52,
      textY: 12,
      endAngle: undefined,
      startAngle: 180,
      marginStyle: '-mb-10',
    },
    full: {
      cy: 140,
      numberY: 0,
      textY: 16,
      endAngle: 180,
      startAngle: 540,
      marginStyle: '-mb-10 -mt-2',
    },
  } as Record<'top' | 'bottom' | 'full', any>;

  const chartVariant = chartVariations[variant];

  const giveStatuses = {
    noact: [1, 7],
    hasact: [2],
    done: [3],
  };

  const takeStatuses = {
    done: [5],
    process: [4],
  };

  const giveChartData = [
    {
      action,
      noact: data
        ? countByTypeAndStatuses(data, giveStatuses.noact, objectType)
        : 0,
      hasact: data
        ? countByTypeAndStatuses(data, giveStatuses.hasact, objectType)
        : 0,
      done: data
        ? countByTypeAndStatuses(data, giveStatuses.done, objectType)
        : 0,
    },
  ];

  const takeChartData = [
    {
      action,
      done: data
        ? countByTypeAndStatuses(data, takeStatuses.done, objectType)
        : 0,
      process: data
        ? countByTypeAndStatuses(data, takeStatuses.process, objectType)
        : 0,
    },
  ];

  const chartData = action === 'give' ? giveChartData : takeChartData;

  const emptyChartData =
    action === 'give'
      ? [
          {
            action,
            noact: 100,
            hasact: 0,
            done: 0,
          },
        ]
      : [
          {
            action,
            done: 0,
            process: 100,
          },
        ];

  const chartConfig: ChartConfig =
    action === 'give'
      ? {
          noact: {
            label: 'Акт не подписан',
            color: equityObjectStatusStyles[1].chartColor,
          },
          hasact: {
            label: 'Акт подписан',
            color: equityObjectStatusStyles[2].chartColor,
          },
          done: {
            label: 'Передано дольщику',
            color: equityObjectStatusStyles[3].chartColor,
          },
        }
      : {
          done: {
            label: 'Передано Москве',
            color: equityObjectStatusStyles[5].chartColor,
          },
          process: {
            label: 'Подлежит передаче',
            color: equityObjectStatusStyles[4].chartColor,
          },
        };

  const total =
    action === 'give'
      ? giveChartData.reduce(
          (acc, cur) => acc + cur.noact + cur.hasact + cur.done,
          0,
        )
      : takeChartData.reduce((acc, cur) => acc + cur.done + cur.process, 0);

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        'mx-auto w-[300px]',
        chartVariant.marginStyle,
        variant === 'full' ? 'aspect-square' : 'aspect-[2/1]',
        className,
      )}
    >
      <RadialBarChart
        data={chartData}
        endAngle={chartVariant.endAngle}
        startAngle={chartVariant.startAngle}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        cy={chartVariant.cy}
      >
        {renderRechartsTooltip({
          config: chartConfig,
          // cursor: true,
          labelWidth: '16rem',
          labelFormatter: () => {
            return (
              <div className="text-lg font-bold">
                {action == 'give' ? 'Передача дольщикам' : 'Передача Москве'}
              </div>
            );
          },
        })}
        {/* <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        /> */}
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    className="cursor-pointer"
                    onClick={() =>
                      navigate({
                        to: './objects',
                        search: {
                          status: action === 'give' ? [1, 2, 7, 3] : [4, 5],
                          type: [objectType],
                        },
                      })
                    }
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + chartVariant.numberY}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {isLoading || !data
                        ? '...'
                        : total.toLocaleString('ru-RU')}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + chartVariant.textY}
                      className="fill-muted-foreground"
                    >
                      {action === 'give'
                        ? 'передается дольщикам'
                        : 'передается городу'}
                    </tspan>
                  </text>
                );
              } else {
                return null;
              }
            }}
          />
        </PolarRadiusAxis>
        {Object.keys(chartConfig).map((key) => {
          return (
            <RadialBar
              key={key}
              dataKey={key}
              stackId="a"
              fill={`var(--color-${key})`}
              className="cursor-pointer stroke-transparent stroke-2"
              onClick={() =>
                navigate({
                  to: './objects',
                  search: {
                    status:
                      action === 'give'
                        ? giveStatuses[key as keyof typeof giveStatuses]
                        : takeStatuses[key as keyof typeof takeStatuses],
                    type: [1],
                  },
                })
              }
            />
          );
        })}
      </RadialBarChart>
    </ChartContainer>
  );
};

export { EquityTotalsGauge };
