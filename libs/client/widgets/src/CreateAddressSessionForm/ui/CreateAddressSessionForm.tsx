import {
  Button,
  cn,
  Form,
  Separator,
  Skeleton,
  useIsMobile,
} from '@urgp/client/shared';
import {
  CreateAddressSessionDto,
  createAddressSessionSchema,
} from '@urgp/shared/entities';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateSession } from '@urgp/client/entities';
import { InputFormField } from '@urgp/client/widgets';
import { Loader, Send, SquareX, ThumbsUp } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ExcelFileInput } from '@urgp/client/features';

type CreateAddressSessionFormProps = {
  className?: string;
  setSessionId?: (id: number) => void;
  addressCount?: number;
  setAddressCount?: (count: number) => void;
  isParsing?: boolean;
  setIsParsing?: (isParsing: boolean) => void;
  extraOnSubmit?: (data: CreateAddressSessionDto) => void;
};

const CreateAddressSessionForm = ({
  className,
  setSessionId,
  addressCount,
  setAddressCount,
  isParsing,
  setIsParsing,
  extraOnSubmit,
}: CreateAddressSessionFormProps): JSX.Element | null => {
  const [addresses, setAddresses] = useState([] as string[]);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const values = {
    type: 'fias-search',
    title: '',
    notes: '',
    addresses: [],
  };

  const [createSession, { isLoading, data: sessionData }] = useCreateSession();
  useEffect(() => {
    setSessionId && sessionData?.id && setSessionId(sessionData.id);
  }, [sessionData]);

  const form = useForm<CreateAddressSessionDto>({
    resolver: zodResolver(createAddressSessionSchema),
    values,
  });

  useEffect(() => {
    form.setValue('addresses', addresses || []);
  }, [addresses]);

  useEffect(() => {
    const shortFileName = fileName?.replace(/(\.[a-z]+)$/, '') || '';
    const title = form.getValues('title');
    if (title === '') {
      form.setValue('title', shortFileName);
    }
  }, [fileName]);

  const parseAddresses = useCallback((data: any[]) => {
    const filteredData = data
      .filter(
        (item: any) =>
          'Адрес' in item && item?.['Адрес'] && item?.['Адрес'] !== '',
      )
      .map((item: any) => item['Адрес']);
    setAddressCount && setAddressCount(filteredData?.length ?? 0);
    return filteredData;
  }, []);

  async function onReset() {
    if (fileInputRef?.current) fileInputRef.current.value = '';
    if (setAddressCount) setAddressCount(0);
    setFileName && setFileName(null);
    form.reset(values);
  }

  async function onSubmit(data: CreateAddressSessionDto) {
    createSession(data)
      .unwrap()
      .then(() => {
        // setSessionId && sessionData?.id && setSessionId(sessionData.id);
        extraOnSubmit && extraOnSubmit(data);
        toast.success('Сессия создана');
      })
      .catch((rejected: any) =>
        toast.error('Не удалось создать сессию', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
    onReset();
  }

  return (
    <Form {...form}>
      <form className={cn('relative flex flex-col gap-4', className)}>
        <ExcelFileInput
          ref={fileInputRef}
          setData={setAddresses}
          parseData={parseAddresses}
          setIsParsing={setIsParsing}
          fileName={fileName}
          setFileName={setFileName}
          extraElement={
            isParsing ? (
              <div className="flex flex-row items-center justify-center gap-1">
                <Loader className="size-4 animate-spin" />
                <span>Обработка файла...</span>
              </div>
            ) : addressCount && addressCount > 0 ? (
              `Содержит ${addressCount.toLocaleString('ru-RU')} адресов`
            ) : (
              'Файл Excel со столбцом "Адрес"'
            )
          }
        />
        <div
          className={cn(
            'flex w-full gap-4',
            isMobile ? 'flex-col' : 'flex-row',
          )}
        >
          <InputFormField
            form={form}
            fieldName={'title'}
            label="Имя запроса"
            placeholder="Назовите запрос"
            className="min-w-[20%] flex-grow-0"
          />
          <InputFormField
            form={form}
            fieldName={'notes'}
            label="Примечания"
            placeholder="Примечания к запросу"
            className="flex-grow"
          />
        </div>

        {addressCount && addressCount > 0 ? (
          <div className="mt-6 flex w-full flex-row justify-end gap-4">
            <Button
              className={cn(
                'flex flex-row gap-2',
                isMobile ? 'flex-grow' : 'min-w-[30%]',
              )}
              type="button"
              variant={'outline'}
              disabled={isLoading || isParsing}
              onClick={onReset}
            >
              {/* <SquareX className="size-4 flex-shrink-0" /> */}
              <span>Отмена</span>
            </Button>

            <Button
              type="button"
              className={cn(
                'flex flex-row gap-2',
                isMobile ? 'flex-grow' : 'min-w-[30%]',
              )}
              variant="default"
              disabled={isLoading || addresses?.length === 0 || isParsing}
              onClick={form.handleSubmit((data) => onSubmit(data))}
            >
              {/* <Send className="size-4 flex-shrink-0" /> */}
              <span>Отправить</span>
            </Button>
          </div>
        ) : null}
      </form>
    </Form>
  );
};

export { CreateAddressSessionForm };
