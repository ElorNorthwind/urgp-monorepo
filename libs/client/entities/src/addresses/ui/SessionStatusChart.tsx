import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  cn,
  Skeleton,
} from '@urgp/client/shared';
import { AddressSessionFull } from '@urgp/shared/entities';
import { Label, Pie, PieChart } from 'recharts';

type SessionStatusChartConfig = {
  session?: AddressSessionFull;
  className?: string;
};

export function SessionStatusChart(props: SessionStatusChartConfig) {
  const { session, className } = props;

  if (!session) {
    return <Skeleton className={cn('rounded-full', className)} />;
  }

  const chartData = [
    { status: 'good', addresses: session.good, fill: 'var(--color-good)' },
    {
      status: 'questionable',
      addresses: session.questionable,
      fill: 'var(--color-questionable)',
    },
    // {
    //   status: 'pending',
    //   addresses: 200,
    //   fill: 'var(--color-pending)',
    // },
    { status: 'error', addresses: session.error, fill: 'var(--color-error)' },
    {
      status: 'pending',
      addresses: session.pending,
      fill: 'var(--color-pending)',
    },
  ];

  const chartConfig = {
    addresses: {
      label: 'Адреса',
    },
    good: {
      label: 'Найдены',
      color: 'hsl(var(--chart-2))',
    },
    questionable: {
      label: 'Неточно',
      color: 'hsl(var(--chart-4))',
    },
    error: {
      label: 'Не найдено',
      color: 'hsl(var(--chart-1))',
    },
    pending: {
      label: 'В очереди',
      color: 'hsl(220, 14%, 96%)',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className={cn('aspect-square', className)}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="addresses"
          nameKey="status"
          innerRadius={50}
          strokeWidth={20}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={(viewBox.cy || 0) - 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {session.total.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24 - 8}
                      className="fill-muted-foreground"
                    >
                      Адресов
                    </tspan>
                  </text>
                );
              } else {
                return null;
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
