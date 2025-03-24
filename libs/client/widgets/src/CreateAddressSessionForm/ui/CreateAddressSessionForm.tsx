import {
  Button,
  cn,
  Form,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  useIsMobile,
} from '@urgp/client/shared';
import {
  CreateAddressSessionDto,
  createAddressSessionSchema,
} from '@urgp/shared/entities';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateSession } from '@urgp/client/entities';
import { ExcelFileInput } from '@urgp/client/features';
import { InputFormField } from '@urgp/client/widgets';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type CreateAddressSessionFormProps = {
  className?: string;
  setSessionId?: (id: number) => void;
  addressCount?: number;
  setAddressCount?: (count: number) => void;
  addressCount2?: number;
  setAddressCount2?: (count: number) => void;
  isParsing?: boolean;
  setIsParsing?: (isParsing: boolean) => void;
  extraOnSubmit?: (data: CreateAddressSessionDto) => void;
};

const CreateAddressSessionForm = ({
  className,
  setSessionId,
  addressCount,
  setAddressCount,
  addressCount2,
  setAddressCount2,
  isParsing,
  setIsParsing,
  extraOnSubmit,
}: CreateAddressSessionFormProps): JSX.Element | null => {
  const [addresses, setAddresses] = useState([] as string[]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [textValue, setTextValue] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Oh God that's bad...
  const [addresses2, setAddresses2] = useState([] as string[]);
  const [fileName2, setFileName2] = useState<string | null>(null);
  const [textValue2, setTextValue2] = useState<string>('');
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // const textInputRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  const values = {
    type: 'fias-search',
    title: '',
    notes: '',
    addresses: [],
    addresses2: [],
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
    form.setValue('addresses2', addresses2 || []);
  }, [addresses2]);

  useEffect(() => {
    const shortFileName = fileName?.replace(/(\.[a-z]+)$/, '') || '';
    const title = form.getValues('title');
    const notes = form.getValues('notes');
    if (title === '' && shortFileName.length > 0) {
      form.setValue('title', shortFileName);
    }
    if (
      (title === '' || title === 'Из текстового поля') &&
      shortFileName.length === 0 &&
      textValue
    ) {
      form.setValue('title', 'Из текстового поля');
    }
    if ((notes === '' || textValue) && addresses.length > 0) {
      form.setValue(
        'notes',
        addresses.slice(0, 3).join('; ').slice(0, 100) + '...',
      );
    }
  }, [fileName, addresses]);

  const parseFile = useCallback((data: any[]) => {
    const filteredData = data
      .filter(
        (item: any) =>
          'Адрес' in item && item?.['Адрес'] && item?.['Адрес'] !== '',
      )
      .map((item: any) => item['Адрес']);
    setTextValue(filteredData.join('\n'));
    setAddressCount && setAddressCount(filteredData?.length ?? 0);
    return filteredData;
  }, []);

  const parseFile2 = useCallback((data: any[]) => {
    const filteredData = data
      .filter(
        (item: any) =>
          'Адрес' in item && item?.['Адрес'] && item?.['Адрес'] !== '',
      )
      .map((item: any) => item['Адрес']);
    setTextValue2(filteredData.join('\n'));
    setAddressCount2 && setAddressCount2(filteredData?.length ?? 0);
    return filteredData;
  }, []);

  async function onReset() {
    if (fileInputRef?.current) fileInputRef.current.value = '';
    if (fileInputRef2?.current) fileInputRef2.current.value = '';
    if (setAddressCount) setAddressCount(0);
    if (setAddressCount2) setAddressCount2(0);
    setFileName && setFileName(null);
    setFileName2 && setFileName2(null);
    setTextValue('');
    setTextValue2('');
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
        <Tabs defaultValue="oneFile">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="oneFile">Из таблицы Excel</TabsTrigger>
            <TabsTrigger value="text">Из текстовой строки</TabsTrigger>
          </TabsList>
          <TabsContent
            value="oneFile"
            className="items-ceter flex flex-row gap-2 [&>div]:flex-grow"
          >
            <ExcelFileInput
              className="h-36"
              ref={fileInputRef}
              setData={setAddresses}
              parseData={parseFile}
              setIsParsing={setIsParsing}
              fileName={fileName}
              setFileName={setFileName}
              extraElement={
                isParsing ? (
                  <div className="flex flex-row items-center justify-center gap-1">
                    <LoaderCircle className="size-4 animate-spin" />
                    <span>Обработка файла...</span>
                  </div>
                ) : addressCount && !!fileName && addressCount > 0 ? (
                  `Содержит ${addressCount.toLocaleString('ru-RU')} адресов`
                ) : (
                  'Файл Excel со столбцом "Адрес"'
                )
              }
            />
            <ExcelFileInput
              label={'Второй список'}
              className="h-36"
              ref={fileInputRef2}
              setData={setAddresses2}
              parseData={parseFile2}
              setIsParsing={setIsParsing}
              fileName={fileName2}
              setFileName={setFileName2}
              extraElement={
                isParsing ? (
                  <div className="flex flex-row items-center justify-center gap-1">
                    <LoaderCircle className="size-4 animate-spin" />
                    <span>Обработка файла...</span>
                  </div>
                ) : addressCount && !!fileName && addressCount > 0 ? (
                  `Содержит ${addressCount.toLocaleString('ru-RU')} адресов`
                ) : (
                  'Файл Excel со столбцом "Адрес"'
                )
              }
            />
          </TabsContent>

          <TabsContent
            value="text"
            className="items-ceter flex flex-row gap-2 [&>div]:flex-grow"
          >
            <div>
              <p
                className={cn(
                  'mb-2 flex justify-between truncate text-left',
                  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                )}
              >
                <span>Список адресов</span>
              </p>
              <Textarea
                value={textValue}
                // ref={textInputRef}
                disabled={isParsing}
                placeholder={
                  'Список адресов (разделённых символом ";" или переноса строки)'
                }
                onChange={(event) => {
                  setIsParsing && setIsParsing(true);
                  setTextValue(event.target.value);
                  setAddresses &&
                    setAddresses(
                      textValue
                        .split(/[\n\r]+/)
                        .map((item) => item.trim())
                        .filter((item) => item !== ''),
                    );
                  setAddressCount && setAddressCount(addresses.length ?? 0);
                  if (fileInputRef?.current) fileInputRef.current.value = '';
                  setFileName && setFileName(null);
                  setIsParsing && setIsParsing(false);
                }}
                className={cn('min-h-36 w-full')}
              />
            </div>
            <div>
              <p
                className={cn(
                  'mb-2 flex justify-between truncate text-left',
                  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                )}
              >
                <span>Второй список</span>
              </p>

              <Textarea
                value={textValue2}
                // ref={textInputRef}
                disabled={isParsing}
                placeholder={
                  'Список адресов (разделённых символом ";" или переноса строки)'
                }
                onChange={(event) => {
                  setIsParsing && setIsParsing(true);
                  setTextValue(event.target.value);
                  setAddresses &&
                    setAddresses(
                      textValue
                        .split(/[\n\r]+/)
                        .map((item) => item.trim())
                        .filter((item) => item !== ''),
                    );
                  setAddressCount && setAddressCount(addresses.length ?? 0);
                  if (fileInputRef?.current) fileInputRef.current.value = '';
                  setFileName && setFileName(null);
                  setIsParsing && setIsParsing(false);
                }}
                className={cn('min-h-36 w-full')}
              />
            </div>
          </TabsContent>
        </Tabs>
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
