import { Button, cn, Form, Separator } from '@urgp/client/shared';
import {
  CreateAddressSessionDto,
  createAddressSessionSchema,
} from '@urgp/shared/entities';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateSession } from '@urgp/client/entities';
import { InputFormField } from '@urgp/client/widgets';
import { Send, SquareX, ThumbsUp } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ExcelFileInput } from '@urgp/client/features';

type CreateAddressSessionFormProps = {
  className?: string;
  setSessionId?: (id: number) => void;
  setAddressCount?: (count: number) => void;
  isParsing?: boolean;
  setIsParsing?: (isParsing: boolean) => void;
  extraOnSubmit?: (data: CreateAddressSessionDto) => void;
};

const CreateAddressSessionForm = ({
  className,
  setSessionId,
  setAddressCount,
  isParsing,
  setIsParsing,
  extraOnSubmit,
}: CreateAddressSessionFormProps): JSX.Element | null => {
  const [addresses, setAddresses] = useState([] as string[]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          // className="h-24"
        />
        <div className="flex w-full flex-row gap-4">
          <InputFormField
            form={form}
            fieldName={'title'}
            label="Имя запроса"
            placeholder="Назовите запрос"
            className="flex-grow-0"
          />
          <InputFormField
            form={form}
            fieldName={'notes'}
            label="Примечания"
            placeholder="Примечания к запросу"
            className="flex-grow"
          />
        </div>

        <div className="mt-6 flex w-full flex-row gap-4">
          <Button
            className="flex flex-grow flex-row gap-2"
            type="button"
            variant={'outline'}
            disabled={isLoading}
            onClick={onReset}
          >
            <SquareX className="size-4 flex-shrink-0" />
            <span>Отмена</span>
          </Button>

          <Button
            type="button"
            className="flex flex-grow flex-row gap-2"
            variant="default"
            disabled={isLoading || addresses?.length === 0 || isParsing}
            onClick={form.handleSubmit((data) => onSubmit(data))}
          >
            <Send className="size-4 flex-shrink-0" />
            <span>Отправить</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { CreateAddressSessionForm };
