import { useGetUserSessions } from '@urgp/client/entities';
import { ExcelFileInput } from '@urgp/client/features';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
} from '@urgp/client/shared';
import { CreateAddressSessionForm } from '@urgp/client/widgets';
import { Loader } from 'lucide-react';
import { useMemo, useState } from 'react';

const AddressUploadPage = (): JSX.Element => {
  const [data, setData] = useState([]) as any;
  const [isParsing, setIsParsing] = useState(false);

  const filteredData = useMemo(
    () =>
      data
        .filter(
          (item: any) =>
            'Адрес' in item && item?.['Адрес'] && item?.['Адрес'] !== '',
        )
        .map((item: any) => item['Адрес']),
    [data],
  );

  return (
    <div className="block space-y-6 p-10 pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Сформировать запрос
          </h2>
          <p className="text-muted-foreground">Выбор адресов для обработки</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex flex-row items-center justify-between">
                <div>Файл в формате Excel</div>
                {isParsing ? (
                  <Skeleton className="h-7 w-60" />
                ) : (
                  filteredData?.length > 0 && (
                    <div className="text-muted-foreground/50 text-xl font-semibold">{`Обнаружено ${filteredData?.length} адресов`}</div>
                  )
                )}
              </CardTitle>
              <CardDescription>
                Должен содержать столбец "Адрес"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ExcelFileInput
                data={data}
                setData={setData}
                setIsParsing={setIsParsing}
              />
            </CardContent>
          </Card>
          {filteredData?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Запрос готов к отправке</CardTitle>
              </CardHeader>
              <CardContent>
                <CreateAddressSessionForm addresses={filteredData} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export { AddressUploadPage };
