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
  // const data = {
  //   nodes: [
  //     { name: 'АИП - поступление за 2026', depth: 5 }, // 0
  //     { name: 'Очередники - ресурс на 2026' }, // 1
  //     { name: 'Сироты - ресурс на 2026' }, // 2
  //     { name: 'Очередники - ресурс на 2027' }, // 3
  //     { name: 'Обеспечение - расход в 2026' }, // 4
  //     { name: 'На продажу - расход в 2026' }, // 5
  //     { name: 'Контроль - ресурс на 2026' }, // 6
  //     { name: 'Контроль - ресурс на 2027' }, // 7
  //     { name: 'Выморочка - поступление за 2026' }, // 8
  //     { name: 'Нереальные к вовлечению' }, // 9
  //     { name: 'Ремонт - ресурс на 2027' }, // 10
  //     { name: 'Аварийка, Дольщики - ресурс на 2026' }, // 11
  //     { name: 'Ремонт - ресурс на 2026' }, // 12
  //     { name: 'Сироты - ресурс на 2027' }, // 13
  //     { name: 'АИП - поступление за 2027', depth: 1 }, // 14
  //     { name: 'Очередники - ресурс на 2028' }, // 15
  //     { name: 'Обеспечение - расход в 2027' }, // 16
  //     { name: 'На продажу - расход в 2027' }, // 17
  //     { name: 'Контроль - ресурс на 2028' }, // 18
  //     { name: 'Выморочка - поступление за 2027' }, // 19
  //     { name: 'Ремонт - ресурс на 2028' }, // 20
  //     { name: 'Аварийка, Дольщики - ресурс на 2027' }, // 21
  //     { name: 'Сироты - ресурс на 2028' }, // 22
  //     { name: 'АИП - поступление за 2028' }, // 23
  //     { name: 'Очередники - ресурс на 2029' }, // 24
  //     { name: 'Обеспечение - расход в 2028' }, // 25
  //     { name: 'На продажу - расход в 2028' }, // 26
  //     { name: 'Контроль - ресурс на 2029' }, // 27
  //     { name: 'Выморочка - поступление за 2028' }, // 28
  //     { name: 'Ремонт - ресурс на 2029' }, // 29
  //     { name: 'Аварийка, Дольщики - ресурс на 2028' }, // 30
  //     { name: 'Сироты - ресурс на 2029' }, // 31
  //   ],

  //   links: [
  //     { source: 0, target: 1, value: 1514 },
  //     { source: 0, target: 2, value: 796 },

  //     { source: 1, target: 3, value: 1877 },
  //     { source: 1, target: 4, value: 1000 },
  //     { source: 1, target: 5, value: 200 },

  //     { source: 6, target: 7, value: 1044 },
  //     { source: 6, target: 5, value: 484 },

  //     { source: 8, target: 9, value: 150 },
  //     { source: 8, target: 10, value: 1000 },
  //     { source: 8, target: 7, value: 200 },
  //     { source: 8, target: 5, value: 150 },

  //     { source: 11, target: 21, value: 814 },
  //     { source: 11, target: 3, value: 106 },
  //     { source: 11, target: 4, value: 500 },
  //     { source: 11, target: 5, value: 228 },

  //     { source: 12, target: 10, value: 588 },
  //     { source: 12, target: 3, value: 588 },
  //     { source: 12, target: 13, value: 546 },

  //     { source: 2, target: 13, value: 211 },
  //     { source: 2, target: 4, value: 900 },

  //     { source: 14, target: 3, value: 70 },
  //     { source: 14, target: 13, value: 20 },

  //     { source: 3, target: 15, value: 1471 },
  //     { source: 3, target: 16, value: 1000 },
  //     { source: 3, target: 17, value: 100 },

  //     { source: 7, target: 18, value: 944 },
  //     { source: 7, target: 17, value: 300 },

  //     { source: 19, target: 9, value: 150 },
  //     { source: 19, target: 20, value: 1000 },
  //     { source: 19, target: 18, value: 200 },
  //     { source: 19, target: 17, value: 150 },

  //     { source: 21, target: 30, value: 264 },
  //     { source: 21, target: 17, value: 50 },
  //     { source: 21, target: 16, value: 500 },

  //     { source: 10, target: 20, value: 388 },
  //     { source: 10, target: 15, value: 700 },
  //     { source: 10, target: 13, value: 500 },

  //     { source: 13, target: 22, value: 377 },
  //     { source: 13, target: 16, value: 900 },

  //     { source: 23, target: 15, value: 850 },
  //     { source: 23, target: 22, value: 120 },

  //     { source: 15, target: 24, value: 1141 },
  //     { source: 15, target: 25, value: 1000 },
  //     { source: 15, target: 26, value: 100 },

  //     { source: 18, target: 27, value: 844 },
  //     { source: 18, target: 26, value: 300 },
  //     { source: 28, target: 9, value: 150 },
  //     { source: 28, target: 29, value: 1000 },
  //     { source: 28, target: 27, value: 200 },
  //     { source: 28, target: 26, value: 150 },

  //     { source: 30, target: 31, value: 114 },
  //     { source: 30, target: 26, value: 50 },
  //     { source: 30, target: 25, value: 100 },

  //     { source: 20, target: 29, value: 188 },
  //     { source: 20, target: 24, value: 500 },
  //     { source: 20, target: 22, value: 700 },

  //     { source: 22, target: 31, value: 297 },
  //     { source: 22, target: 25, value: 900 },

  //     { source: 29, target: 24, value: 488 },
  //     { source: 29, target: 31, value: 700 },

  //     { source: 0, target: 11, value: 0.00000000000000000001 },
  //     { source: 0, target: 6, value: 0.00000000000000000001 },

  //     { source: 1, target: 14, value: 0.00000000000000000001 },
  //     { source: 1, target: 19, value: 0.00000000000000000001 },
  //     { source: 1, target: 10, value: 0.00000000000000000001 },
  //     { source: 19, target: 7, value: 0.00000000000000000001 },
  //     { source: 4, target: 7, value: 0.00000000000000000001 },
  //     { source: 5, target: 7, value: 0.00000000000000000001 },

  //     { source: 3, target: 28, value: 0.00000000000000000001 },
  //     { source: 3, target: 20, value: 0.00000000000000000001 },
  //     { source: 3, target: 23, value: 0.00000000000000000001 },
  //     { source: 28, target: 15, value: 0.00000000000000000001 },
  //     { source: 20, target: 15, value: 0.00000000000000000001 },
  //     { source: 16, target: 15, value: 0.00000000000000000001 },
  //     { source: 17, target: 15, value: 0.00000000000000000001 },

  //     { source: 15, target: 29, value: 0.00000000000000000001 },
  //     { source: 25, target: 29, value: 0.00000000000000000001 },
  //     { source: 26, target: 29, value: 0.00000000000000000001 },
  //     { source: 4, target: 21, value: 0.00000000000000000001 },
  //   ],
  // };

  const data = {
    nodes: [
      { name: '!Нер-2025', hidden: true },
      { name: '!Нер-2026-с', hidden: true },
      { name: '!Нер-2026', hidden: true },
      { name: '!Нер-2027-с', hidden: true },
      { name: '!Нер-2027', hidden: true },
      { name: '!Нер-2028-с', hidden: true },
      { name: '!Нер-2028', hidden: true },
      { name: 'Нереальные к вовлечению' },
      { name: 'Выморочка - поступление за 2026' },
      { name: '!Вым-2026-с', hidden: true },
      { name: 'Выморочка - поступление за 2027' },
      { name: '!Вым-2027-с', hidden: true },
      { name: 'Выморочка - поступление за 2028' },
      { name: '!Вым-2028-с', hidden: true },
      { name: '!Вым-2028', hidden: true },
      { name: '!Вым-2029-с', hidden: true },
      { name: 'Ремонт - ресурс на 2026' },
      { name: '!Рем-2026-с', hidden: true },
      { name: 'Ремонт - ресурс на 2027' },
      { name: '!Рем-2027-с', hidden: true },
      { name: 'Ремонт - ресурс на 2028' },
      { name: '!Рем-2028-с', hidden: true },
      { name: 'Ремонт - ресурс на 2029' },
      { name: '!Рем-2029-с', hidden: true },
      { name: 'АИП - поступление за 2026' },
      { name: '!АИП-2026-с', hidden: true },
      { name: 'АИП - поступление за 2027' },
      { name: '!АИП-2027-с', hidden: true },
      { name: 'АИП - поступление за 2028' },
      { name: '!АИП-2028-с', hidden: true },
      { name: '!АИП-2028', hidden: true },
      { name: '!АИП-2029-с', hidden: true },
      { name: '!Оче-2025', hidden: true },
      { name: 'Очередники - ресурс на 2026' },
      { name: '!Оче-2026', hidden: true },
      { name: 'Очередники - ресурс на 2027' },
      { name: '!Оче-2027', hidden: true },
      { name: 'Очередники - ресурс на 2028' },
      { name: '!Оче-2028', hidden: true },
      { name: 'Очередники - ресурс на 2029' },
      { name: '!Сир-2025', hidden: true },
      { name: 'Сироты - ресурс на 2026' },
      { name: '!Сир-2026', hidden: true },
      { name: 'Сироты - ресурс на 2027' },
      { name: '!Сир-2027', hidden: true },
      { name: 'Сироты - ресурс на 2028' },
      { name: '!Сир-2028', hidden: true },
      { name: 'Сироты - ресурс на 2029' },
      { name: '!Ава-2025', hidden: true },
      { name: 'Аварийка, Дольщики - ресурс на 2026' },
      { name: '!Ава-2026', hidden: true },
      { name: 'Аварийка, Дольщики - ресурс на 2027' },
      { name: '!Ава-2027', hidden: true },
      { name: 'Аварийка, Дольщики - ресурс на 2028' },
      { name: '!Ава-2028', hidden: true },
      { name: 'Аварийка, Дольщики - ресурс на 2029' },
      { name: '!Кон-2025', hidden: true },
      { name: 'Контроль - ресурс на 2026' },
      { name: '!Кон-2026', hidden: true },
      { name: 'Контроль - ресурс на 2027' },
      { name: '!Кон-2027', hidden: true },
      { name: 'Контроль - ресурс на 2028' },
      { name: '!Кон-2028', hidden: true },
      { name: 'Контроль - ресурс на 2029' },
      { name: '!Обе-2025', hidden: true },
      { name: '!Обе-2026-с', hidden: true },
      { name: 'Обеспечение - расход в 2026' },
      { name: '!Обе-2027-с', hidden: true },
      { name: 'Обеспечение - расход в 2027' },
      { name: '!Обе-2028-с', hidden: true },
      { name: 'Обеспечение - расход в 2028' },
      { name: '!Обе-2029-с', hidden: true },
      { name: '!Про-2025', hidden: true },
      { name: '!Про-2026-с', hidden: true },
      { name: 'На продажу - расход в 2026' },
      { name: '!Про-2027-с', hidden: true },
      { name: 'На продажу - расход в 2027' },
      { name: '!Про-2028-с', hidden: true },
      { name: 'На продажу - расход в 2028' },
      { name: '!Про-2029-с', hidden: true },
    ],

    links: [
      { source: 0, target: 1, value: 0.00000000000000000001 },
      { source: 1, target: 2, value: 0.00000000000000000001 },
      { source: 2, target: 3, value: 0.00000000000000000001 },
      { source: 3, target: 4, value: 0.00000000000000000001 },
      { source: 4, target: 5, value: 0.00000000000000000001 },
      { source: 5, target: 6, value: 0.00000000000000000001 },
      { source: 6, target: 7, value: 0.00000000000000000001 },
      { source: 8, target: 7, value: 150 },
      { source: 8, target: 9, value: 0.00000000000000000001 },
      { source: 8, target: 18, value: 1000 },
      { source: 8, target: 59, value: 200 },
      { source: 8, target: 74, value: 150 },
      { source: 9, target: 10, value: 0.00000000000000000001 },
      { source: 10, target: 7, value: 150 },
      { source: 10, target: 11, value: 0.00000000000000000001 },
      { source: 10, target: 20, value: 1000 },
      { source: 10, target: 61, value: 200 },
      { source: 10, target: 76, value: 150 },
      { source: 11, target: 12, value: 0.00000000000000000001 },
      { source: 12, target: 7, value: 150 },
      { source: 12, target: 13, value: 0.00000000000000000001 },
      { source: 12, target: 22, value: 1000 },
      { source: 12, target: 63, value: 200 },
      { source: 12, target: 78, value: 150 },
      { source: 13, target: 14, value: 0.00000000000000000001 },
      { source: 14, target: 15, value: 0.00000000000000000001 },
      { source: 16, target: 17, value: 0.00000000000000000001 },
      { source: 16, target: 18, value: 588 },
      { source: 16, target: 35, value: 588 },
      { source: 16, target: 43, value: 546 },
      { source: 17, target: 18, value: 0.00000000000000000001 },
      { source: 18, target: 19, value: 0.00000000000000000001 },
      { source: 18, target: 20, value: 388 },
      { source: 18, target: 37, value: 700 },
      { source: 18, target: 43, value: 500 },
      { source: 19, target: 20, value: 0.00000000000000000001 },
      { source: 20, target: 21, value: 0.00000000000000000001 },
      { source: 20, target: 22, value: 188 },
      { source: 20, target: 39, value: 500 },
      { source: 20, target: 45, value: 700 },
      { source: 21, target: 22, value: 0.00000000000000000001 },
      { source: 22, target: 23, value: 0.00000000000000000001 },
      { source: 22, target: 39, value: 488 },
      { source: 22, target: 47, value: 700 },
      { source: 24, target: 25, value: 0.00000000000000000001 },
      { source: 24, target: 33, value: 1514 },
      { source: 24, target: 41, value: 796 },
      { source: 25, target: 26, value: 0.00000000000000000001 },
      { source: 26, target: 27, value: 0.00000000000000000001 },
      { source: 26, target: 35, value: 70 },
      { source: 26, target: 43, value: 20 },
      { source: 27, target: 28, value: 0.00000000000000000001 },
      { source: 28, target: 29, value: 0.00000000000000000001 },
      { source: 28, target: 37, value: 850 },
      { source: 28, target: 45, value: 120 },
      { source: 29, target: 30, value: 0.00000000000000000001 },
      { source: 30, target: 31, value: 0.00000000000000000001 },
      { source: 32, target: 33, value: 0.00000000000000000001 },
      { source: 33, target: 34, value: 0.00000000000000000001 },
      { source: 33, target: 35, value: 1877 },
      { source: 33, target: 66, value: 1000 },
      { source: 33, target: 74, value: 200 },
      { source: 34, target: 35, value: 0.00000000000000000001 },
      { source: 35, target: 36, value: 0.00000000000000000001 },
      { source: 35, target: 37, value: 1471 },
      { source: 35, target: 68, value: 1000 },
      { source: 35, target: 76, value: 100 },
      { source: 36, target: 37, value: 0.00000000000000000001 },
      { source: 37, target: 38, value: 0.00000000000000000001 },
      { source: 37, target: 39, value: 1141 },
      { source: 37, target: 70, value: 1000 },
      { source: 37, target: 78, value: 100 },
      { source: 38, target: 39, value: 0.00000000000000000001 },
      { source: 40, target: 41, value: 0.00000000000000000001 },
      { source: 41, target: 42, value: 0.00000000000000000001 },
      { source: 41, target: 43, value: 211 },
      { source: 41, target: 66, value: 900 },
      { source: 42, target: 43, value: 0.00000000000000000001 },
      { source: 43, target: 44, value: 0.00000000000000000001 },
      { source: 43, target: 45, value: 377 },
      { source: 43, target: 68, value: 900 },
      { source: 44, target: 45, value: 0.00000000000000000001 },
      { source: 45, target: 46, value: 0.00000000000000000001 },
      { source: 45, target: 47, value: 297 },
      { source: 45, target: 70, value: 900 },
      { source: 46, target: 47, value: 0.00000000000000000001 },
      { source: 48, target: 49, value: 0.00000000000000000001 },
      { source: 49, target: 35, value: 106 },
      { source: 49, target: 50, value: 0.00000000000000000001 },
      { source: 49, target: 51, value: 814 },
      { source: 49, target: 66, value: 500 },
      { source: 49, target: 74, value: 228 },
      { source: 50, target: 51, value: 0.00000000000000000001 },
      { source: 51, target: 52, value: 0.00000000000000000001 },
      { source: 51, target: 53, value: 264 },
      { source: 51, target: 68, value: 500 },
      { source: 51, target: 76, value: 50 },
      { source: 52, target: 53, value: 0.00000000000000000001 },
      { source: 53, target: 54, value: 0.00000000000000000001 },
      { source: 53, target: 55, value: 114 },
      { source: 53, target: 70, value: 100 },
      { source: 53, target: 78, value: 50 },
      { source: 54, target: 55, value: 0.00000000000000000001 },
      { source: 56, target: 57, value: 0.00000000000000000001 },
      { source: 57, target: 58, value: 0.00000000000000000001 },
      { source: 57, target: 59, value: 1044 },
      { source: 57, target: 74, value: 484 },
      { source: 58, target: 59, value: 0.00000000000000000001 },
      { source: 59, target: 60, value: 0.00000000000000000001 },
      { source: 59, target: 61, value: 944 },
      { source: 59, target: 76, value: 300 },
      { source: 60, target: 61, value: 0.00000000000000000001 },
      { source: 61, target: 62, value: 0.00000000000000000001 },
      { source: 61, target: 63, value: 844 },
      { source: 61, target: 78, value: 300 },
      { source: 62, target: 63, value: 0.00000000000000000001 },
      { source: 64, target: 65, value: 0.00000000000000000001 },
      { source: 65, target: 66, value: 0.00000000000000000001 },
      { source: 66, target: 67, value: 0.00000000000000000001 },
      { source: 67, target: 68, value: 0.00000000000000000001 },
      { source: 68, target: 69, value: 0.00000000000000000001 },
      { source: 69, target: 70, value: 0.00000000000000000001 },
      { source: 70, target: 71, value: 0.00000000000000000001 },
      { source: 72, target: 73, value: 0.00000000000000000001 },
      { source: 73, target: 74, value: 0.00000000000000000001 },
      { source: 74, target: 75, value: 0.00000000000000000001 },
      { source: 75, target: 76, value: 0.00000000000000000001 },
      { source: 76, target: 77, value: 0.00000000000000000001 },
      { source: 77, target: 78, value: 0.00000000000000000001 },
      { source: 78, target: 79, value: 0.00000000000000000001 },
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
            align={'left'}
            verticalAlign={'top'}
            className="-mt-2"
            // width={960}
            // width="100%"
            // height={400}
            margin={{ top: 10, bottom: 20, left: 6, right: 6 }}
            data={data}
            nodeWidth={10}
            nodePadding={40}
            linkCurvature={0.61}
            iterations={64}
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
