import { ChartConfig, cn } from '@urgp/client/shared';
import { Bar, Cell } from 'recharts';

type ReChartTooltip = {
  config: ChartConfig;
  data: any[] | undefined;
  orientation?: 'vertical' | 'horizontal';
  onClick?: (data: any, index: number) => void;
};

const renderRechartsStackedBar = ({
  config,
  data,
  orientation = 'horizontal',
  onClick,
}: ReChartTooltip): JSX.Element => {
  const radius: [number, number, number, number] =
    orientation === 'vertical' ? [4, 4, 0, 0] : [0, 4, 4, 0];

  return (
    <>
      {Object.keys(config).map((status) => {
        return (
          <Bar
            key={status}
            dataKey={status}
            fill={`var(--color-${status})`}
            stackId="a"
            radius={radius}
            onClick={onClick}
            className={cn(onClick ? 'cursor-pointer' : '')}
            label={(props) => {
              const { x, y, width, height, index } = props;
              console.log(JSON.stringify(props, null, 2));
              if (!data) return <></>;
              const total = Object.keys(config).reduce((total, key) => {
                return total + data[index as number][key];
              }, 0);
              const val =
                data[index as number][status as keyof (typeof data)[0]];
              return (
                <text
                  x={x + width / 2}
                  y={y + height / 2}
                  dy={5}
                  fill="rgba(255, 255, 255, 0.6)"
                  fontSize="12"
                  textAnchor="middle"
                  pointerEvents={'none'}
                >
                  {(orientation === 'horizontal' ? width : height) > 12
                    ? val
                    : ''}
                </text>
              );
            }}
          >
            {data &&
              data.map((entry, index) => {
                const keys = Object.keys(config);
                const keysSoFar = keys.slice(
                  0,
                  keys.findIndex((key) => key === status) + 1,
                );

                const total = keys.reduce((acc, curr) => {
                  const value = entry[curr as keyof typeof entry];
                  return (
                    acc +
                    (typeof value === 'number'
                      ? (value as number)
                      : parseInt(value as string))
                  );
                }, 0);

                const runningTotal = keysSoFar.reduce((acc, curr) => {
                  const value = entry[curr as keyof typeof entry];
                  return (
                    acc +
                    (typeof value === 'number'
                      ? (value as number)
                      : parseInt(value as string))
                  );
                }, 0);

                if (total === runningTotal) {
                  return <Cell key={`cell-${index}`}></Cell>;
                }
                return <Cell key={`cell-${index}`} radius={0}></Cell>;
              })}
          </Bar>
        );
      })}
    </>
  );
};

export { renderRechartsStackedBar };
