import { Button, cn, Form, useAuth } from '@urgp/client/shared';
import {
  CreateManualDateDto,
  createManualDateSchema,
} from '@urgp/shared/entities';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateManualDate, useRelocationTypes } from '@urgp/client/entities';
import {
  ClassificatorFormField,
  DateFormField,
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { endOfYesterday, isBefore, startOfToday } from 'date-fns';
import { SquareX, ThumbsUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useMemo } from 'react';

type ManualDateFormProps = {
  buildingId: number;
  className?: string;
  dialogWidth?: string;
};

const ManualDateForm = ({
  buildingId,
  className,
  dialogWidth = '600px',
}: ManualDateFormProps): JSX.Element | null => {
  const user = useAuth();
  const { data: relocationTypes, isLoading: isRelocationTypesLoading } =
    useRelocationTypes();
  const [createDate, { isLoading }] = useCreateManualDate();

  const controlDate = useMemo(() => {
    return startOfToday().toISOString();
  }, []);

  const values: CreateManualDateDto = {
    buildingId,
    controlDate, // new Date().toISOString(),
    documents: '',
    notes: '',
    typeId: 1,
  };

  const form = useForm<CreateManualDateDto>({
    resolver: zodResolver(createManualDateSchema),
    values,
  });

  if (!['admin', 'editor'].some((role) => user.roles.includes(role)))
    return null;

  async function onSubmit(data: CreateManualDateDto) {
    createDate(data)
      .unwrap()
      .then(() => {
        toast.success('Дата добавлена');
      })
      .catch((rejected: any) =>
        toast.error('Не удалось добавить дату', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
    form.reset(values);
  }

  return (
    <Form {...form}>
      <form className={cn('relative flex flex-col gap-2', className)}>
        <ClassificatorFormField
          form={form}
          fieldName={'typeId'}
          classificator={relocationTypes}
          isLoading={isRelocationTypesLoading}
          label="Тип даты"
          placeholder="Выбор вида даты"
          popoverMinWidth={`calc(${dialogWidth} - 3rem)`}
          className="flex-grow"
        />
        <div className="flex w-full flex-row gap-2">
          <InputFormField
            form={form}
            fieldName={'documents'}
            label="Номер документа"
            placeholder="Реквизиты"
          />
          <DateFormField
            form={form}
            fieldName={'controlDate'}
            label="Дата решения"
            placeholder="Дата"
            className={cn('flex-shrink-0')}
          />
        </div>
        <TextAreaFormField
          form={form}
          fieldName={'notes'}
          label="Комментарий"
          placeholder="Комментарий к дате"
        />
        <div className="flex w-full flex-row gap-2">
          <Button
            className="flex flex-grow flex-row gap-2"
            type="button"
            variant={'outline'}
            disabled={isLoading}
            onClick={() => form.reset(values)}
          >
            <SquareX className="size-4 flex-shrink-0" />
            <span>Отмена</span>
          </Button>
          <Button
            type="button"
            className="flex flex-grow flex-row gap-2"
            variant="default"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            <ThumbsUp className="size-4 flex-shrink-0" />
            <span>Сохранить</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { ManualDateForm };
