import { useNavigate } from '@tanstack/react-router';
import { useCases } from '@urgp/client/entities';
import { SimpleBarChart } from '@urgp/client/features';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { ServerCrash } from 'lucide-react';
import { useMemo } from 'react';

const countByDepartment = (department: string, cases?: Case[]) => {
  return (
    cases?.filter((c) =>
      c?.payload?.directions.some((dir) => dir.category === department),
    )?.length || 0
  );
};

type DepartmentChartProps = {
  className?: string;
};

const DepartmentChart = ({ className }: DepartmentChartProps): JSX.Element => {
  const {
    data: cases,
    isLoading: isCasesLoading,
    isFetching: isCasesFetching,
    isError,
  } = useCases();
  const isLoading = isCasesLoading || isCasesFetching;

  // УРЖП: { badgeStyle: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100' },
  // УВЖУ: { badgeStyle: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
  // УПГУ: { badgeStyle: 'bg-amber-50 border-amber-200 hover:bg-amber-100' },
  // УП: { badgeStyle: 'bg-slate-50 border-slate-200 hover:bg-slate-100' },
  // УОЖП: { badgeStyle: 'bg-violet-50 border-violet-200 hover:bg-violet-100' },

  const chartData = useMemo(() => {
    return [
      {
        key: 'УРЖП',
        label: 'УРЖП (Лукьянов М.Г.)',
        value: countByDepartment('УРЖП', cases),
        style: 'bg-cyan-200',
      },
      {
        key: 'УПГУ',
        label: 'УПГУ (Курзина Ю.А.)',
        value: countByDepartment('УПГУ', cases),
        style: 'bg-amber-200',
      },
      {
        key: 'УВЖУ',
        label: 'УВЖУ (Мусиенко О.А.)',
        value: countByDepartment('УВЖУ', cases),
        style: 'bg-emerald-200',
      },
      {
        key: 'УП',
        label: 'УП (Замураев А.Ю.)',
        value: countByDepartment('УП', cases),
        style: 'bg-slate-200',
      },
      {
        key: 'УОЖП',
        label: 'УОЖП (Пахмутов С.А.)',
        value: countByDepartment('УОЖП', cases),
        style: 'bg-violet-200',
      },
    ];
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
        <CardTitle>Тематики дел</CardTitle>
        <CardDescription>В разбивке по управлениям</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-end gap-4">
        <SimpleBarChart
          values={chartData.sort((a, b) => b.value - a.value)}
          isLoading={isLoading}
          isError={isError}
          skeletonCount={5}
          barClassName={cn('bg-slate-300')}
          labelFit="full"
          className="z-10 max-w-full flex-grow"
          onBarClick={(key) =>
            navigate({
              to: './cases',
              search: { department: [key] },
            })
          }
        />
        {/* <div
          className={cn(
            'select-none text-8xl font-semibold text-slate-200',
            // '-mr-2 -mt-[100%] flex-shrink-0 ',
            'absolute right-2 top-0 z-0',
          )}
        >
          {isError ? (
            <ServerCrash className="m-3 size-16" />
          ) : isLoading ? (
            ''
          ) : (
            chartData.reduce((acc, cur) => acc + cur.value, 0)
          )}
        </div> */}
      </CardContent>
    </Card>
  );
};

export { DepartmentChart };
