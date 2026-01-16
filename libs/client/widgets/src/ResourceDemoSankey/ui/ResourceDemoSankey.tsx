import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  cn,
} from '@urgp/client/shared';
import { Sankey } from 'recharts';
import { SankeyNode } from './SankeyNode';
import { SankeyLink } from './SankeyLink';

const SankeyChartConfig = {
  // ─── АИП ─────────────────────────────────────────────
  'АИП - поступление за 2026': {
    label: 'АИП - поступление за 2026',
    color: '#6FD3D8',
  },
  'АИП - поступление за 2027': {
    label: 'АИП - поступление за 2027',
    color: '#6FD3D8',
  },
  'АИП - поступление за 2028': {
    label: 'АИП - поступление за 2028',
    color: '#6FD3D8',
  },

  // ─── Выморочка ───────────────────────────────────────
  'Выморочка - поступление за 2026': {
    label: 'Выморочка - поступление за 2026',
    color: '#B59A8F',
  },
  'Выморочка - поступление за 2027': {
    label: 'Выморочка - поступление за 2027',
    color: '#B59A8F',
  },
  'Выморочка - поступление за 2028': {
    label: 'Выморочка - поступление за 2028',
    color: '#B59A8F',
  },

  // ─── Очередники ──────────────────────────────────────
  'Очередники - ресурс на 2026': {
    label: 'Очередники - ресурс на 2026',
    color: '#2C7FB8',
  },
  'Очередники - ресурс на 2027': {
    label: 'Очередники - ресурс на 2027',
    color: '#2C7FB8',
  },
  'Очередники - ресурс на 2028': {
    label: 'Очередники - ресурс на 2028',
    color: '#2C7FB8',
  },
  'Очередники - ресурс на 2029': {
    label: 'Очередники - ресурс на 2029',
    color: '#2C7FB8',
  },

  // ─── Сироты ──────────────────────────────────────────
  'Сироты - ресурс на 2026': {
    label: 'Сироты - ресурс на 2026',
    color: '#F4A261',
  },
  'Сироты - ресурс на 2027': {
    label: 'Сироты - ресурс на 2027',
    color: '#F4A261',
  },
  'Сироты - ресурс на 2028': {
    label: 'Сироты - ресурс на 2028',
    color: '#F4A261',
  },
  'Сироты - ресурс на 2029': {
    label: 'Сироты - ресурс на 2029',
    color: '#F4A261',
  },

  // ─── Аварийка / Дольщики ─────────────────────────────
  'Аварийка, Дольщики - ресурс на 2026': {
    label: 'Аварийка, Дольщики - ресурс на 2026',
    color: '#C7CF5E',
  },
  'Аварийка, Дольщики - ресурс на 2027': {
    label: 'Аварийка, Дольщики - ресурс на 2027',
    color: '#C7CF5E',
  },
  'Аварийка, Дольщики - ресурс на 2028': {
    label: 'Аварийка, Дольщики - ресурс на 2028',
    color: '#C7CF5E',
  },
  'Аварийка, Дольщики - ресурс на 2029': {
    label: 'Аварийка, Дольщики - ресурс на 2029',
    color: '#C7CF5E',
  },

  // ─── Контроль ────────────────────────────────────────
  'Контроль - ресурс на 2026': {
    label: 'Контроль - ресурс на 2026',
    color: '#9C7ACF',
  },
  'Контроль - ресурс на 2027': {
    label: 'Контроль - ресурс на 2027',
    color: '#9C7ACF',
  },
  'Контроль - ресурс на 2028': {
    label: 'Контроль - ресурс на 2028',
    color: '#9C7ACF',
  },
  'Контроль - ресурс на 2029': {
    label: 'Контроль - ресурс на 2029',
    color: '#9C7ACF',
  },

  // ─── Ремонт ──────────────────────────────────────────
  'Ремонт - ресурс на 2026': {
    label: 'Ремонт - ресурс на 2026',
    color: '#BDBDBD',
  },
  'Ремонт - ресурс на 2027': {
    label: 'Ремонт - ресурс на 2027',
    color: '#BDBDBD',
  },
  'Ремонт - ресурс на 2028': {
    label: 'Ремонт - ресурс на 2028',
    color: '#BDBDBD',
  },
  'Ремонт - ресурс на 2029': {
    label: 'Ремонт - ресурс на 2029',
    color: '#BDBDBD',
  },

  // ─── Расход ──────────────────────────────────────────
  'Обеспечение - расход в 2026': {
    label: 'Обеспечение - расход в 2026',
    color: '#2E7D32',
  },
  'Обеспечение - расход в 2027': {
    label: 'Обеспечение - расход в 2027',
    color: '#2E7D32',
  },
  'Обеспечение - расход в 2028': {
    label: 'Обеспечение - расход в 2028',
    color: '#2E7D32',
  },

  'На продажу - расход в 2026': {
    label: 'На продажу - расход в 2026',
    color: '#C62828',
  },
  'На продажу - расход в 2027': {
    label: 'На продажу - расход в 2027',
    color: '#C62828',
  },
  'На продажу - расход в 2028': {
    label: 'На продажу - расход в 2028',
    color: '#C62828',
  },

  // ─── Прочее ──────────────────────────────────────────
  'Нереальные к вовлечению': {
    label: 'Нереальные к вовлечению',
    color: '#C05BA6',
  },
} satisfies ChartConfig;

type ResourceDemoSankeyProps = {
  className?: string;
};

const ResourceDemoSankey = ({
  className,
}: ResourceDemoSankeyProps): JSX.Element => {
  const data = {
    nodes: [
      { name: 'АИП - поступление за 2026', depth: 0 }, // 0
      { name: 'Очередники - ресурс на 2026' }, // 1
      { name: 'Сироты - ресурс на 2026' }, // 2
      { name: 'Очередники - ресурс на 2027' }, // 3
      { name: 'Обеспечение - расход в 2026' }, // 4
      { name: 'На продажу - расход в 2026' }, // 5
      { name: 'Контроль - ресурс на 2026' }, // 6
      { name: 'Контроль - ресурс на 2027' }, // 7
      { name: 'Выморочка - поступление за 2026' }, // 8
      { name: 'Нереальные к вовлечению' }, // 9
      { name: 'Ремонт - ресурс на 2027' }, // 10
      { name: 'Аварийка, Дольщики - ресурс на 2026' }, // 11
      { name: 'Ремонт - ресурс на 2026' }, // 12
      { name: 'Сироты - ресурс на 2027' }, // 13
      { name: 'АИП - поступление за 2027', depth: 1 }, // 14
      { name: 'Очередники - ресурс на 2028' }, // 15
      { name: 'Обеспечение - расход в 2027' }, // 16
      { name: 'На продажу - расход в 2027' }, // 17
      { name: 'Контроль - ресурс на 2028' }, // 18
      { name: 'Выморочка - поступление за 2027' }, // 19
      { name: 'Ремонт - ресурс на 2028' }, // 20
      { name: 'Аварийка, Дольщики - ресурс на 2027' }, // 21
      { name: 'Сироты - ресурс на 2028' }, // 22
      { name: 'АИП - поступление за 2028' }, // 23
      { name: 'Очередники - ресурс на 2029' }, // 24
      { name: 'Обеспечение - расход в 2028' }, // 25
      { name: 'На продажу - расход в 2028' }, // 26
      { name: 'Контроль - ресурс на 2029' }, // 27
      { name: 'Выморочка - поступление за 2028' }, // 28
      { name: 'Ремонт - ресурс на 2029' }, // 29
      { name: 'Аварийка, Дольщики - ресурс на 2028' }, // 30
      { name: 'Сироты - ресурс на 2029' }, // 31
    ],

    links: [
      { source: 0, target: 1, value: 1514 },
      { source: 0, target: 2, value: 796 },

      { source: 1, target: 3, value: 1877 },
      { source: 1, target: 4, value: 1000 },
      { source: 1, target: 5, value: 200 },

      { source: 6, target: 7, value: 1044 },
      { source: 6, target: 5, value: 484 },

      { source: 8, target: 9, value: 150 },
      { source: 8, target: 10, value: 1000 },
      { source: 8, target: 7, value: 200 },
      { source: 8, target: 5, value: 150 },

      { source: 11, target: 21, value: 814 },
      { source: 11, target: 3, value: 106 },
      { source: 11, target: 4, value: 500 },
      { source: 11, target: 5, value: 228 },

      { source: 12, target: 10, value: 588 },
      { source: 12, target: 3, value: 588 },
      { source: 12, target: 13, value: 546 },

      { source: 2, target: 13, value: 211 },
      { source: 2, target: 4, value: 900 },

      { source: 14, target: 3, value: 70 },
      { source: 14, target: 13, value: 20 },

      { source: 3, target: 15, value: 1471 },
      { source: 3, target: 16, value: 1000 },
      { source: 3, target: 17, value: 100 },

      { source: 7, target: 18, value: 944 },
      { source: 7, target: 17, value: 300 },

      { source: 19, target: 9, value: 150 },
      { source: 19, target: 20, value: 1000 },
      { source: 19, target: 18, value: 200 },
      { source: 19, target: 17, value: 150 },

      { source: 21, target: 30, value: 264 },
      { source: 21, target: 17, value: 50 },
      { source: 21, target: 16, value: 500 },

      { source: 10, target: 20, value: 388 },
      { source: 10, target: 15, value: 700 },
      { source: 10, target: 13, value: 500 },

      { source: 13, target: 22, value: 377 },
      { source: 13, target: 16, value: 900 },

      { source: 23, target: 15, value: 850 },
      { source: 23, target: 22, value: 120 },

      { source: 15, target: 24, value: 1141 },
      { source: 15, target: 25, value: 1000 },
      { source: 15, target: 26, value: 100 },

      { source: 18, target: 27, value: 844 },
      { source: 18, target: 26, value: 300 },
      { source: 28, target: 9, value: 150 },
      { source: 28, target: 29, value: 1000 },
      { source: 28, target: 27, value: 200 },
      { source: 28, target: 26, value: 150 },

      { source: 30, target: 31, value: 114 },
      { source: 30, target: 26, value: 50 },
      { source: 30, target: 25, value: 100 },

      { source: 20, target: 29, value: 188 },
      { source: 20, target: 24, value: 500 },
      { source: 20, target: 22, value: 700 },

      { source: 22, target: 31, value: 297 },
      { source: 22, target: 25, value: 900 },

      { source: 29, target: 24, value: 488 },
      { source: 29, target: 31, value: 700 },
    ],
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="flex flex-row items-center justify-between">
          <span>{`Планирование городского ресурса жилых помещений`}</span>
        </CardTitle>

        <CardDescription className="">
          {'На период 2026 - 2028 годов'}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100vh-5rem)]">
        <ChartContainer
          className="h-full w-full overflow-hidden pt-0"
          config={SankeyChartConfig}
        >
          <Sankey
            className="-mt-2"
            // width={960}
            // width="100%"
            // height={400}
            margin={{ top: 10, bottom: 20, left: 6, right: 6 }}
            data={data}
            nodeWidth={10}
            nodePadding={20}
            linkCurvature={0.61}
            iterations={32}
            link={<SankeyLink config={SankeyChartConfig} />}
            node={
              <SankeyNode containerWidth={300} config={SankeyChartConfig} />
            }
            sort={false}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent indicator="line" className="w-[400px]" />
              }
            />
          </Sankey>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export { ResourceDemoSankey };
