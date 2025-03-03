import { Button, cn, Form } from '@urgp/client/shared';
import {
  CreateAddressSessionDto,
  createAddressSessionSchema,
} from '@urgp/shared/entities';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateSession } from '@urgp/client/entities';
import { InputFormField } from '@urgp/client/widgets';
import { SquareX, ThumbsUp } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type CreateAddressSessionFormProps = {
  addresses?: string[];
  className?: string;
  setSessionId?: (id: number) => void;
};

const CreateAddressSessionForm = ({
  addresses,
  className,
  setSessionId,
}: CreateAddressSessionFormProps): JSX.Element | null => {
  const values = {
    type: 'fias-search',
    title: '',
    notes: '',
    addresses: addresses || [],
  };

  const [createSession, { isLoading, data: sessionData }] = useCreateSession();

  const form = useForm<CreateAddressSessionDto>({
    resolver: zodResolver(createAddressSessionSchema),
    values,
  });

  useEffect(() => {
    form.setValue('addresses', addresses || []);
  }, [addresses]);

  async function onSubmit(data: CreateAddressSessionDto) {
    createSession(data)
      .unwrap()
      .then(() => {
        setSessionId && sessionData?.id && setSessionId(sessionData.id);
        toast.success('Сессия создана');
      })
      .catch((rejected: any) =>
        toast.error('Не удалось создать сессию', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
    form.reset(values);
  }

  return (
    <Form {...form}>
      <form className={cn('relative flex flex-col gap-2', className)}>
        <div className="flex w-full flex-row gap-2">
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
            disabled={isLoading || addresses?.length === 0}
            onClick={form.handleSubmit((data) => onSubmit(data))}
          >
            <ThumbsUp className="size-4 flex-shrink-0" />
            <span>Отправить</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { CreateAddressSessionForm };
