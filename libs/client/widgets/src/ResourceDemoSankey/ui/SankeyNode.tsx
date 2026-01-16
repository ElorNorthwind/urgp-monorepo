import { Rectangle, Layer } from 'recharts';

// const CurrentYearSankeyChart = ({
//   className,
// }: CurrentYearSankeyChartProps): JSX.Element =>

const SankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
  config,
}: any) => {
  const isOut = x + width + 6 > containerWidth;
  if (payload?.hidden) return null;
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x + (isOut ? 2 : -2)}
        y={y}
        width={width}
        height={height}
        fill={config?.[payload.name]?.color || `hsl(var(--chart-${index}))`}
        stroke={config?.[payload.name]?.color || `hsl(var(--chart-${index}))`}
        // fill={`hsl(var(--chart-${index}))`}
        fillOpacity="1"
        radius={2}
      />
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 - 4}
        fontSize="14"
      >
        {payload.depth + '. ' + payload.name}
      </text>
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 18}
        fontSize="24"
        // fill={config?.[payload.name]?.color || `hsl(var(--chart-${index}))`}
        // fill={`hsl(var(--chart-${index}))`}
        // fontStyle={'bold'}
      >
        {payload.value}
      </text>
    </Layer>
  );
};

export { SankeyNode };
