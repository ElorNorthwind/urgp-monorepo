import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Form,
  Skeleton,
  useIsMobile,
} from '@urgp/client/shared';
import { AddDefectDataDto, addDefectDataSchema } from '@urgp/shared/entities';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePostApartmentDefects } from '@urgp/client/entities';
import { ExcelFileInput } from '@urgp/client/features';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { parseDefectsExcel } from '../lib/parseDefectsExcel';

type RenovationDefectsFileUploadFormProps = {
  className?: string;
  // setSessionId?: (id: number) => void;
  // addressCount?: number;
  // setAddressCount?: (count: number) => void;
  // addressCount2?: number;
  // setAddressCount2?: (count: number) => void;
  // isParsing?: boolean;
  // setIsParsing?: (isParsing: boolean) => void;
  // extraOnSubmit?: (data: CreateAddressSessionDto) => void;
};

const RenovationDefectsFileUploadForm = ({
  className,
}: RenovationDefectsFileUploadFormProps): JSX.Element | null => {
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [postDefects, { isLoading }] = usePostApartmentDefects();

  const isMobile = useIsMobile();

  const values: AddDefectDataDto = { defects: [] };
  const form = useForm<AddDefectDataDto>({
    resolver: zodResolver(addDefectDataSchema),
    values,
  });

  const defects = form.watch('defects');

  const parseFile = useCallback((data: any[]) => {
    return parseDefectsExcel(data);
  }, []);

  async function onReset() {
    if (fileInputRef?.current) fileInputRef.current.value = '';
    form.reset(values);
  }

  async function onSubmit(data: AddDefectDataDto) {
    const chunkSize = 9000;
    let i = 0;
    while (i < data.defects.length) {
      const chunk = data.defects.slice(i, i + chunkSize);
      await postDefects({ defects: chunk })
        .unwrap()
        .then(() => {
          toast.success('Передано дефектов: ' + chunk?.length);
        })
        .catch((rejected: any) =>
          toast.error('Не удалось передать дефекты', {
            description: rejected.data?.message || 'Неизвестная ошибка',
          }),
        );
      i += chunkSize;
    }
    onReset();
  }

  return (
    <Card>
      <CardHeader className="bg-muted-foreground/5 mb-4 pb-4">
        <CardTitle className="relative flex flex-row items-center justify-between">
          <span>Загрузить информацию о дефектах</span>
          {isMobile === false &&
            (isParsing ? (
              <Skeleton className="absolute right-2 top-1 h-7 w-60" />
            ) : (
              defects?.length > 0 && (
                <span className="text-muted-foreground/50 absolute right-2 top-1 text-2xl font-semibold">{`${defects?.length?.toLocaleString('ru-RU')} записей`}</span>
              )
            ))}
        </CardTitle>
        <CardDescription>
          Файл Excel со списком дефектов по заданной форме
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className={cn('relative flex flex-col gap-4', className)}>
            <ExcelFileInput
              label={'Выбрать файл'}
              className="h-36"
              ref={fileInputRef}
              setData={(val) => {
                form.setValue('defects', val);
              }}
              parseData={parseFile}
              setIsParsing={setIsParsing}
              extraElement={
                isParsing ? (
                  <div className="flex flex-row items-center justify-center gap-1">
                    <LoaderCircle className="size-4 animate-spin" />
                    <span>Обработка файла...</span>
                  </div>
                ) : defects && defects?.length > 0 ? (
                  `Содержит ${defects?.length?.toLocaleString('ru-RU')} записей`
                ) : (
                  'Файл Excel заданного формата'
                )
              }
            />
            <div className="items-ceter flex flex-row gap-4 [&>div]:flex-grow">
              {defects?.length && defects?.length > 0 ? (
                <>
                  <Button
                    className={cn(
                      'flex flex-row gap-2',
                      isMobile ? 'flex-grow' : 'ml-auto min-w-[30%]',
                    )}
                    type="button"
                    variant={'outline'}
                    disabled={isLoading || isParsing}
                    onClick={onReset}
                  >
                    <span>Отмена</span>
                  </Button>

                  <Button
                    type="button"
                    className={cn(
                      'flex flex-row gap-2',
                      isMobile ? 'flex-grow' : 'min-w-[30%]',
                    )}
                    variant="default"
                    disabled={isLoading || defects?.length === 0 || isParsing}
                    onClick={form.handleSubmit((data) => onSubmit(data))}
                  >
                    <span>Отправить</span>
                  </Button>
                </>
              ) : null}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { RenovationDefectsFileUploadForm };
