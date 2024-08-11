import {
  Button,
  Calendar,
  cn,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  selectCurrentUser,
  Textarea,
} from '@urgp/client/shared';
import {
  CreateMessageFormValuesDto,
  messageCreateFormValues,
} from '@urgp/shared/entities';
import { useSelector } from 'react-redux';
import { useCreateMessage } from '../api/messagesApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { add } from 'date-fns';

type CreateMessageFormProps = {
  apartmentId: number;
  className?: string;
  refetch: () => void;
};
const CreateMessageForm = ({
  className,
  apartmentId,
  refetch,
}: CreateMessageFormProps): JSX.Element => {
  const user = useSelector(selectCurrentUser);

  const form = useForm<CreateMessageFormValuesDto>({
    resolver: zodResolver(messageCreateFormValues),
    defaultValues: {
      messageContent: '',
      validUntil: null,
    },
  });

  const [createMessage, { isLoading, isError, error }] = useCreateMessage();

  async function onSubmit(data: CreateMessageFormValuesDto) {
    createMessage({ ...data, authorId: user?.id || 0, apartmentId })
      .unwrap()
      .then(() => {
        refetch();
        form.reset();
        toast.success('Сообщение создано');
      })
      .catch((rejected) =>
        toast.error('Не удалось создать сообщение', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  }

  if (
    !user ||
    (!user.roles.includes('editor') &&
      !user.roles.includes('admin') &&
      !user.roles.includes('boss'))
  ) {
    return <></>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'bg-background relative grid w-full gap-4 rounded border p-2',
          className,
        )}
      >
        {/* <div className={cn('grid gap-4 text-center', className)}> */}
        <FormField
          control={form.control}
          name="messageContent"
          render={({ field }) => (
            <FormItem className="grid">
              <FormLabel className=" text-left">
                {form.formState.errors.messageContent ? (
                  <p className="flex justify-between truncate">
                    Текст сообщения
                    <span className="w-full text-right text-xs font-light">
                      {form.formState.errors.messageContent.message}
                    </span>
                  </p>
                ) : (
                  'Текст сообщения'
                )}
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Введите сообщение" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="validUntil"
          render={({ field }) => (
            <div className="bg-background absolute bottom-0 left-[-310px] hidden rounded border p-2">
              <FormItem className="grid">
                <FormLabel className="text-left">
                  {form.formState.errors.validUntil ? (
                    <p className="flex justify-between truncate">
                      Забыть до
                      <span className="w-full text-right text-xs font-light">
                        {form.formState.errors.validUntil.message}
                      </span>
                    </p>
                  ) : (
                    'Забыть до'
                  )}
                </FormLabel>

                <Calendar
                  mode="single"
                  selected={field.value || undefined}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date() || date >= add(new Date(), { years: 1 })
                  }
                  // initialFocus
                />
              </FormItem>
            </div>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          Отпаравить сообщение
        </Button>
        {/* </div> */}
      </form>
    </Form>
  );
};

export { CreateMessageForm };
