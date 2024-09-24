import { ChartConfig } from '@urgp/client/shared';
import { Bar, Cell } from 'recharts';

type ReChartTooltip = {
  config: ChartConfig;
  data: any[] | undefined;
  orientation?: 'vertical' | 'horizontal';
};

const renderRechartsStackedBar = ({
  config,
  data,
  orientation = 'horizontal',
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
                  fill="white"
                  fontSize="12"
                  textAnchor="middle"
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
