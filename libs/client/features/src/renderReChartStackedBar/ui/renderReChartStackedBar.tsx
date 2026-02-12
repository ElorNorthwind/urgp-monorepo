import { ChartConfig, cn } from '@urgp/client/shared';
import { Bar, Cell } from 'recharts';

type ReChartTooltip = {
  config: ChartConfig;
  data: any[] | undefined;
  orientation?: 'vertical' | 'horizontal';
  onClick?: (data: any, index: number, status?: string) => void;
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
            // tabIndex={-1}
            stackId="a"
            radius={radius}
            onClick={(data, index) => onClick && onClick(data, index, status)}
            className={cn(onClick ? 'cursor-pointer' : '')}
            label={(props) => {
              const { x, y, width, height, index } = props;

              const textWidth =
                typeof width === 'number'
                  ? width
                  : parseInt((width as string) || '0');

              const textHeight =
                typeof height === 'number'
                  ? height
                  : parseInt((height as string) || '0');

              const textX =
                typeof x === 'number' ? x : parseInt((x as string) || '0');

              const textY =
                typeof y === 'number' ? y : parseInt((y as string) || '0');

              if (!data) return <></>;
              const total = Object.keys(config).reduce((total, key) => {
                return total + data[index as number][key];
              }, 0);
              const val =
                data[index as number][status as keyof (typeof data)[0]];
              return (
                <text
                  x={textX + textWidth / 2}
                  y={textY + textHeight / 2}
                  dy={5}
                  fill="rgba(255, 255, 255, 0.6)"
                  fontSize="12"
                  textAnchor="middle"
                  pointerEvents={'none'}
                >
                  {(orientation === 'horizontal' ? textWidth : textHeight) > 12
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
