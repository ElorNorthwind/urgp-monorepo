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
import { CaseFull } from '@urgp/shared/entities';
import { useMemo } from 'react';

const countByDepartment = (department: string, cases?: CaseFull[]) => {
  return (
    cases?.filter((c) =>
      c?.directions.some((dir) => dir?.category === department),
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

  const chartData = useMemo(() => {
    return [
      {
        key: 'УРЖП',
        label: 'УРЖП (Лукьянов М.Г.)',
        value: countByDepartment('УРЖП', cases),
        style: 'bg-blue-200',
      },
      {
        key: 'УПГУ',
        label: 'УПГУ (Курзина Ю.А.)',
        value: countByDepartment('УПГУ', cases),
        style: 'bg-orange-200',
      },
      {
        key: 'УВЖУ',
        label: 'УВЖУ (Мусиенко О.А.)',
        value: countByDepartment('УВЖУ', cases),
        style: 'bg-teal-200',
      },
      {
        key: 'УП',
        label: 'УП (Замураев А.Ю.)',
        value: countByDepartment('УП', cases),
        style: 'bg-rose-200',
      },
      {
        key: 'УОЖП',
        label: 'УОЖП (Пахмутов С.А.)',
        value: countByDepartment('УОЖП', cases),
        style: 'bg-purple-200',
      },
      {
        key: 'УИ',
        label: 'УИ (Николаев А.В.)',
        value: countByDepartment('УИ', cases),
        style: 'bg-lime-200',
      },
    ];
  }, [cases, isLoading]);

  const navigate = useNavigate({ from: '/control' });

  return (
    <Card
      className={cn(
        'relative flex flex-col items-stretch justify-start overflow-hidden',
        // 'to-muted-foreground/10 bg-gradient-to-bl from-cyan-600/40',
        className,
      )}
    >
      <CardHeader className="">
        <CardTitle>Тематики дел</CardTitle>
        <CardDescription>В разбивке по управлениям</CardDescription>
      </CardHeader>
      <CardContent className=" mt-0 flex flex-row justify-start gap-4 ">
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
      </CardContent>
    </Card>
  );
};

export { DepartmentChart };
