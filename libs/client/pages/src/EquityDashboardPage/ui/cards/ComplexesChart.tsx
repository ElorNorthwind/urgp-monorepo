import { useEquityComplexList, useEquityTotals } from '@urgp/client/entities';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Skeleton,
} from '@urgp/client/shared';
import { Building2 } from 'lucide-react';
import { EquityTotalsGroup } from '../charts/EquityTotalsGroup';
import { useNavigate } from '@tanstack/react-router';

type ComplexesChartProps = {
  className?: string;
};

const ComplexesChart = ({ className }: ComplexesChartProps): JSX.Element => {
  const {
    data,
    isLoading: isDataLoading,
    isFetching: isDataFetching,
  } = useEquityTotals();

  const {
    data: complexList,
    isLoading: isComplexLoading,
    isFetching: isComplexFetching,
  } = useEquityComplexList();

  const isLoading =
    isDataLoading || isDataFetching || isComplexLoading || isComplexFetching;

  const navigate = useNavigate({ from: '/equity' });

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        {isLoading ? (
          <Skeleton className="size-12 flex-shrink-0 rounded-md" />
        ) : (
          <Building2 className="size-12 flex-shrink-0" />
        )}
        <div>
          {isLoading ? (
            <div>
              <Skeleton className="mb-1 h-6 w-32" />
              <Skeleton className="mb-1 h-4 w-44" />
            </div>
          ) : (
            <CardTitle className="flex flex-row items-center justify-between">
              <span>Данные по жилым комплексам</span>
            </CardTitle>
          )}
          {isLoading ? (
            <Skeleton className="h-4 w-60" />
          ) : (
            <CardDescription className="">
              Количество переданных объектов в каждом из ЖК
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading || !data ? (
          <div>
            <Skeleton className="h-80 w-full" />
          </div>
        ) : (
          complexList &&
          complexList.length > 0 && (
            <>
              <h1 className="/w-full -mx-6 mt-4 bg-blue-500/10 py-2 text-center text-2xl font-bold">
                АО "Мосотделстрой № 1"
              </h1>
              {complexList
                .filter((item) => item?.complex?.developer === 'МОС1')
                .map((item) => (
                  <EquityTotalsGroup
                    key={item?.complex?.id}
                    data={data}
                    isLoading={isLoading}
                    scope="complex"
                    target={item?.complex?.id}
                    className="w-full"
                    title={'ЖК ' + item?.complex?.name || '...'}
                    buildingList={item?.buildingIds}
                    subtitle={
                      'Введено: ' +
                      (item?.buildingsDone || 0) +
                      ' из ' +
                      ((item?.buildingsProject || 0) +
                        (item?.buildingsDone || 0)) +
                      ' корп.'
                    }
                    customMax={1500}
                  />
                ))}
              <h1 className="/w-full -mx-6 mt-8 bg-green-500/10 py-2 text-center text-2xl font-bold">
                Фонд защиты прав участников долевого строительства
              </h1>
              {complexList
                .filter((item) => item?.complex?.developer === 'Фонд')
                .map((item) => (
                  <EquityTotalsGroup
                    key={item?.complex?.id}
                    data={data}
                    isLoading={isLoading}
                    scope="complex"
                    target={item?.complex?.id}
                    className="w-full"
                    title={'ЖК ' + item?.complex?.name || '...'}
                    buildingList={item?.buildingIds}
                    subtitle={
                      'Введено: ' +
                      (item?.buildingsDone || 0) +
                      ' из ' +
                      ((item?.buildingsProject || 0) +
                        (item?.buildingsDone || 0)) +
                      ' корп.'
                    }
                    customMax={1500}
                  />
                ))}
            </>
          )
        )}
      </CardContent>
    </Card>
  );
};

export { ComplexesChart };
