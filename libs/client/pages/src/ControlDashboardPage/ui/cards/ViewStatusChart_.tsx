import { useNavigate } from '@tanstack/react-router';
import { useCases } from '@urgp/client/entities';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  cn,
} from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { Circle, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

const chartConfig = {
  cases: {
    label: 'Дела',
    // color: 'hsl(var(--chart-3))',
    color: '#80cbc4',
  },
} satisfies ChartConfig;

const countByViewStatus = (status: string, cases?: Case[]) => {
  return cases?.filter((c) => c?.viewStatus === status)?.length || 0;
};

type ViewStatusChartRechartsProps = {
  className?: string;
  chartClassName?: string;
};

const ViewStatusChartRecharts = ({
  className,
  chartClassName,
}: ViewStatusChartRechartsProps): JSX.Element => {
  const {
    data: cases,
    isLoading: isCasesLoading,
    isFetching: isCasesFetching,
    isError,
  } = useCases();
  const isLoading = isCasesLoading || isCasesFetching;

  const chartData = useMemo(() => {
    return [
      // {
      //   status: 'Не слежу',
      //   cases: byViewStatus('unwatched', cases),
      //   search: { viewStatus: 'unwatched' },
      // },
      {
        status: 'Без изменений',
        cases: 2,
        // cases: countByViewStatus('unchanged', cases),
        search: { viewStatus: ['unchanged'] },
      },
      {
        status: 'Новое дело',
        cases: 10,
        // cases: countByViewStatus('new', cases),
        search: { viewStatus: ['new'] },
      },
      {
        status: 'Есть изменения',
        cases: 4,
        // cases: countByViewStatus('changed', cases),
        search: { viewStatus: ['changed'] },
      },
    ];
    // cases?.reduce((acc, cur) => {return {...acc, [cur?.viewStatus]}}, {})
  }, [cases, isLoading]);

  const navigate = useNavigate({ from: '/control' });

  return (
    <Card
      className={cn(
        'relative flex flex-col items-stretch justify-stretch overflow-hidden',
        className,
      )}
    >
      <CardHeader className="">
        <CardTitle>Я отслеживаю</CardTitle>
        <CardDescription>Дела, на которые я подписан</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-end">
        <ChartContainer
          config={chartConfig}
          className={cn('h-full flex-grow', chartClassName)}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <XAxis type="number" dataKey="cases" hide />
            <YAxis
              hide
              dataKey="status"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar
              dataKey="cases"
              fill="var(--color-cases)"
              className="cursor-pointer overflow-hidden"
              radius={5}
              onClick={(data: any) => {
                navigate({
                  to: './cases',
                  search: data?.search,
                });
              }}
            >
              <LabelList
                dataKey="status"
                position="insideLeft"
                offset={8}
                // className="fill-background"
                className="fill-foreground pointer-events-none"
                // className="fill-[--color-state]"
                fontSize={12}
              />
              <LabelList
                formatter={(value: number) => (value > 0 ? value : null)}
                dataKey="cases"
                position="insideRight"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="text-muted-foreground/20 -mb-2 -mt-[100%] flex-shrink-0 text-9xl font-semibold">
          {chartData.reduce((acc, cur) => acc + cur.cases, 0)}
        </div>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 pt-6 text-sm"> */}
      {/* <div className="text-muted-foreground leading-none">
          {chartData.reduce((acc, cur) => acc + cur.cases, 0)}
        </div> */}
      {/* <div className="text-muted-foreground/20 absolute bottom-2 right-2 z-0 text-9xl font-semibold">
        {chartData.reduce((acc, cur) => acc + cur.cases, 0)}
      </div> */}
      {/* </CardFooter> */}
    </Card>

    // <Card className={cn(className)}>
    //   <CardHeader className="space-y-0 pb-2">
    //     {isLoading || isFetching ? (
    //       <div>
    //         <Skeleton className="mb-1 h-6 w-32" />
    //         <Skeleton className="mb-1 h-4 w-44" />
    //       </div>
    //     ) : (
    //       <CardTitle className="flex flex-row items-center justify-between">
    //         <span>Сроки завершения домов</span>
    //         <Button
    //           variant={'ghost'}
    //           className="ml-auto h-6 py-0 px-1"
    //           onClick={() => setOnlyFull((value) => !value)}
    //         >
    //           <span
    //             className="flex flex-row items-center gap-1"
    //             style={{ color: 'hsl(var(--chart-1))' }}
    //           >
    //             {onlyFull ? (
    //               <>
    //                 <Eye className="h-4 w-4" />
    //                 <span className="hidden sm:block">показать неполное</span>
    //               </>
    //             ) : (
    //               <>
    //                 <EyeOff className="h-4 w-4" />
    //                 <span className="hidden sm:block">скрыть неполное</span>
    //               </>
    //             )}
    //           </span>
    //         </Button>
    //       </CardTitle>
    //     )}
    //     {isLoading || isFetching ? (
    //       <Skeleton className="h-4 w-60" />
    //     ) : (
    //       <CardDescription className="h-16">
    //         {'Динамика длительносии переселения по годам' +
    //           (onlyFull ? '' : ' (включая частичное и поэтапное)')}
    //       </CardDescription>
    //     )}
    //   </CardHeader>
    //   <CardContent>
    //     {isLoading || isFetching ? (
    //       <div>
    //         <Skeleton className="mb-2 h-[200px] w-full" />
    //         <Skeleton className="mx-auto h-4 w-44" />
    //       </div>
    //     ) : (
    //       <ChartContainer
    //         config={doneAgeChartConfig}
    //         className="mt-[-35px] h-full w-full lg:h-[250px]"
    //       >
    //         <BarChart
    //           accessibilityLayer
    //           data={
    //             onlyFull
    //               ? data?.map((entry) => {
    //                   return {
    //                     ...entry,
    //                     '0': entry['0f'],
    //                     '1': entry['1f'],
    //                     '2': entry['2f'],
    //                     '5': entry['5f'],
    //                     '8': entry['8f'],
    //                   };
    //                 })
    //               : data
    //           }
    //           margin={{ top: 10, right: 0, left: 0, bottom: -10 }}
    //         >
    //           <CartesianGrid
    //             vertical={true}
    //             verticalCoordinatesGenerator={(props) => {
    //               return [
    //                 ...props.xAxis.domain.map(
    //                   (_: number, index: number) =>
    //                     index * (props.width / props.xAxis.domain.length),
    //                 ),
    //                 props.width,
    //               ];
    //             }}
    //           />
    //           <XAxis dataKey={'year'} tickLine={false} axisLine={false} />
    //           <YAxis
    //             type="number"
    //             tickLine={false}
    //             axisLine={false}
    //             hide
    //             domain={[0, 'dataMax + 15']}
    //           />
    //           {renderRechartsTooltip({
    //             config: doneAgeChartConfig,
    //             cursor: { fill: 'transparent' },
    //           })}
    //           {Object.keys(doneAgeChartConfig).map((key) => {
    //             return (
    //               <Bar
    //                 key={key}
    //                 dataKey={key}
    //                 fill={`var(--color-${key})`}
    //                 radius={[4, 4, 0, 0]}
    //                 label={(props) => {
    //                   const { x, y, width, value, index } = props;
    //                   return (
    //                     <text
    //                       y={y}
    //                       x={x + width / 2}
    //                       dy={-4}
    //                       fontSize="8"
    //                       textAnchor="middle"
    //                     >
    //                       {data &&
    //                         value > 0 &&
    //                         `${Math.floor(
    //                           (value /
    //                             Object.keys(doneAgeChartConfig).reduce(
    //                               (acc, curr) =>
    //                                 acc +
    //                                   data[index as number][
    //                                     curr as keyof (typeof data)['0']
    //                                   ] || 0,
    //                               0,
    //                             )) *
    //                             100,
    //                         )}%`}
    //                     </text>
    //                   );
    //                 }}
    //               >
    //                 <LabelList
    //                   formatter={(value: number) => (value > 20 ? value : null)}
    //                   position="inside"
    //                   className="fill-white/60"
    //                   fontSize={8}
    //                 />
    //               </Bar>
    //             );
    //           })}
    //           {/* <ChartLegend content={<ChartLegendContent />} /> */}
    //         </BarChart>
    //       </ChartContainer>
    //     )}
    //   </CardContent>
    // </Card>
  );
};

export { ViewStatusChartRecharts };
