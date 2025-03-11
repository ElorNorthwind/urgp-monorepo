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
import { v4 as uuidv4 } from 'uuid';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateSession } from '@urgp/client/entities';
import {
  DateFormField,
  InputFormField,
  SelectFormField,
} from '@urgp/client/widgets';
import { Loader, LoaderCircle, Send, SquareX, ThumbsUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ExcelFileInput } from '@urgp/client/features';
import { RdType, RdXMLFormSchema, RdXMLFormValues } from '../model/types';
import { generateXml } from '../lib/generateXML';
import { emptyFormValues, RdTypeOptions } from '../config/constants';

type CreateXMLFormProps = {
  className?: string;
};

const CreateXMLForm = ({
  className,
}: CreateXMLFormProps): JSX.Element | null => {
  const isMobile = useIsMobile();

  // const guid = useMemo(() => uuidv4(), []);

  // const values = {
  //   guid: '',
  //   rdNum: '',
  //   rdDate: new Date().toISOString(),
  //   fileName: '',
  //   rdType: RdType.BuildingToNonResidential,
  //   cadNum: '',
  // };

  const form = useForm<RdXMLFormValues>({
    resolver: zodResolver(RdXMLFormSchema),
    values: emptyFormValues,
  });

  async function onReset() {
    form.reset(emptyFormValues);
    form.setValue('guid', uuidv4());
  }

  async function onSubmit(data: RdXMLFormValues) {
    generateXml(data);
    onReset();
  }

  return (
    <Form {...form}>
      <form className={cn('relative flex flex-col gap-4', className)}>
        <SelectFormField
          form={form}
          options={RdTypeOptions}
          valueType="string"
          fieldName={'rdType'}
          label="Вид распоряжения"
          placeholder="Тип документа"
          className="flex-shrink-0"
        />
        <div
          className={cn(
            'flex w-full gap-4',
            isMobile ? 'flex-col' : 'flex-row',
          )}
        >
          <DateFormField
            form={form}
            fieldName={'rdDate'}
            label="Дата РД"
            placeholder="Дата регистрации РД"
            className="flex-shrink-0"
          />
          <InputFormField
            form={form}
            fieldName={'rdNum'}
            label="Номер РД"
            placeholder="12345"
            className="flex-grow"
          />
          <InputFormField
            form={form}
            fieldName={'fileName'}
            label="Имя файла"
            placeholder="Точное название файла"
            className="flex-grow"
          />
        </div>
        <div
          className={cn(
            'flex w-full gap-4',
            isMobile ? 'flex-col' : 'flex-row',
          )}
        >
          <InputFormField
            form={form}
            fieldName={'guid'}
            label="GUID"
            placeholder="Случайный номер XML"
            className="min-w-[18rem] flex-grow-0"
          />
          <InputFormField
            form={form}
            fieldName={'cadNum'}
            label="Кадастровый номер объекта"
            placeholder="77:11123131:11"
            className="flex-grow"
          />
        </div>

        <div className="mt-6 flex w-full flex-row justify-end gap-4">
          <Button
            className={cn(
              'flex flex-row gap-2',
              isMobile ? 'flex-grow' : 'min-w-[30%]',
            )}
            type="button"
            variant={'outline'}
            // disabled={isLoading || isParsing}
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
            // disabled={isLoading || addresses?.length === 0 || isParsing}
            onClick={form.handleSubmit((data) => onSubmit(data))}
          >
            <span>Сформировать</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { CreateXMLForm };
