import {
  Button,
  cn,
  Form,
  Label,
  Switch,
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

  const [showDouble, setShowDouble] = useState(false);

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
        {JSON.stringify(addresses)}
        {JSON.stringify(addresses2)}
        <Tabs defaultValue="oneFile">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="oneFile">Из таблицы Excel</TabsTrigger>
            <TabsTrigger value="text">Из текстовой строки</TabsTrigger>
          </TabsList>
          <TabsContent value="oneFile">
            <div className="items-ceter flex flex-row gap-2 [&>div]:flex-grow">
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
                containerClassName={cn(showDouble ? '' : 'hidden')}
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
                  ) : addressCount2 && !!fileName && addressCount2 > 0 ? (
                    `Содержит ${addressCount2.toLocaleString('ru-RU')} адресов`
                  ) : (
                    'Файл Excel со столбцом "Адрес"'
                  )
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="text">
            <div className="items-ceter flex flex-row gap-2 [&>div]:flex-grow">
              <div>
                <p
                  className={cn(
                    'mb-2 flex justify-between truncate text-left',
                    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                  )}
                >
                  Список адресов
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
              <div className={cn(showDouble ? '' : 'hidden')}>
                <p
                  className={cn(
                    'mb-2 flex justify-between truncate text-left',
                    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                  )}
                >
                  Второй список
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
                    setTextValue2(event.target.value);
                    setAddresses2 &&
                      setAddresses2(
                        textValue
                          .split(/[\n\r\;]+/)
                          .map((item) => item.trim())
                          .filter((item) => item !== ''),
                      );
                    setAddressCount2 &&
                      setAddressCount2(addresses2.length ?? 0);
                    if (fileInputRef2?.current)
                      fileInputRef2.current.value = '';
                    setFileName2 && setFileName2(null);
                    setIsParsing && setIsParsing(false);
                  }}
                  className={cn('min-h-36 w-full')}
                />
              </div>
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

        <div
          className={cn(
            'mt-6 flex w-full justify-start gap-4',
            isMobile ? 'flex-col' : 'min-h-10 flex-row',
          )}
        >
          <div
            className={cn('flex flex-col gap-2', isMobile ? 'flex-grow' : '')}
          >
            <div className="flex items-center space-x-2">
              <Switch
                id="showDouble"
                checked={showDouble}
                onCheckedChange={(v) => {
                  if (fileInputRef2?.current) fileInputRef2.current.value = '';
                  if (setAddressCount2) setAddressCount2(0);
                  setFileName2 && setFileName2(null);
                  setTextValue2('');
                  setShowDouble(v);
                }}
              />
              <Label htmlFor="showDouble" className={'cursor-pointer pr-2'}>
                {showDouble ? (
                  <p>Режим сравнения списков</p>
                ) : (
                  <p>Режим одного списка</p>
                )}
              </Label>
            </div>
          </div>

          {addressCount && addressCount > 0 ? (
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
            </>
          ) : null}
        </div>
      </form>
    </Form>
  );
};

export { CreateAddressSessionForm };
