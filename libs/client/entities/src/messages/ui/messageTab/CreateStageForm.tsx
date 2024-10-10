import {
  Button,
  Calendar,
  cn,
  Combobox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  selectCurrentUser,
  Skeleton,
} from '@urgp/client/shared';
import {
  CreateStageFormValuesDto,
  ExtendedStage,
  Stage,
  stageCreateFormValues,
  UpdateStageFormValuesDto,
} from '@urgp/shared/entities';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useEffect } from 'react';
import {
  useCreateStage,
  useStageTypes,
  useUpdateStage,
} from '../../api/stagesApi';
import { CalendarIcon } from 'lucide-react';

type CreateStageFormProps = {
  apartmentId: number;
  className?: string;
  refetch?: () => void;
  editStage?: Stage | null;
  setEditStage?: React.Dispatch<React.SetStateAction<ExtendedStage | null>>;
};

const initialValues = {
  messageContent: '',
  docDate: new Date(),
  docNumber: undefined,
  stageId: undefined,
};

const CreateStageForm = ({
  className,
  apartmentId,
  refetch,
  editStage,
  setEditStage,
}: CreateStageFormProps): JSX.Element | null => {
  const user = useSelector(selectCurrentUser);

  const form = useForm<CreateStageFormValuesDto>({
    resolver: zodResolver(stageCreateFormValues),
    defaultValues: initialValues,
  });

  const [createStage, { isLoading }] = useCreateStage();
  const [updateStage, { isLoading: isUpdateLoading }] = useUpdateStage();
  const { data: stageTypes, isLoading: isStageTypesLoading } = useStageTypes();

  async function onSubmit(data: CreateStageFormValuesDto) {
    createStage({ ...data, authorId: user?.id || 0, apartmentId })
      .unwrap()
      .then(() => {
        refetch && refetch();
        form.reset(initialValues);
        toast.success('Этап добавлен');
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((rejected: any) =>
        toast.error('Не удалось добавить этап', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  }

  async function onEditSubmit(data: UpdateStageFormValuesDto) {
    updateStage({ ...data, id: editStage?.id || 0 })
      .unwrap()
      .then(() => {
        refetch && refetch();
        form.reset(initialValues);
        setEditStage && setEditStage(null);
        toast.success('Этап изменен');
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((rejected: any) =>
        toast.error('Не удалось изменить этап', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  }

  useEffect(() => {
    if (editStage) {
      form.reset(editStage);
    }
  }, [editStage, form]);

  if (
    !user ||
    !(
      user.roles.includes('user') ||
      user.roles.includes('editor') ||
      user.roles.includes('admin') ||
      user.roles.includes('boss')
    )
  ) {
    return null;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(editStage ? onEditSubmit : onSubmit)}
        className={cn(
          'bg-background relative grid w-full gap-4 border-t p-2 transition',
          className,
        )}
      >
        {/* {editStage && (
          <div className="line-clamp-2 relative overflow-hidden rounded bg-amber-100 p-1 pl-5 text-sm text-amber-700">
            <div className="absolute top-1 bottom-1 left-1 w-2 rounded-sm bg-amber-300"></div>
            <p className="truncate">{editStage.messageContent}</p>
          </div>
        )} */}
        <FormField
          control={form.control}
          name="messageContent"
          render={({ field }) => (
            <FormItem className="grid">
              <FormLabel className="text-left">
                {form.formState.errors.messageContent ? (
                  <p className="flex justify-between truncate">
                    Текст примечания
                    <span className="w-full text-right text-xs font-light">
                      {form.formState.errors.messageContent.message}
                    </span>
                  </p>
                ) : (
                  'Текст примечания'
                )}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Примечание"
                  {...field}
                  name="messageContent"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="docNumber"
          render={({ field }) => (
            <FormItem className="grid">
              <FormLabel className="text-left">
                {form.formState.errors.messageContent ? (
                  <p className="flex justify-between truncate">
                    Номер документа
                    <span className="w-full text-right text-xs font-light">
                      {form.formState.errors.messageContent.message}
                    </span>
                  </p>
                ) : (
                  'Номер документа'
                )}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Номер документа"
                  {...field}
                  name="messageContent"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="docDate"
          render={({ field }) => (
            <FormItem className="grid">
              <FormLabel className="text-left">
                {form.formState.errors.messageContent ? (
                  <p className="flex justify-between truncate">
                    Дата документа
                    <span className="w-full text-right text-xs font-light">
                      {form.formState.errors.messageContent.message}
                    </span>
                  </p>
                ) : (
                  'Дата документа'
                )}
              </FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'dd.MM.yyyy')
                      ) : (
                        <span>Дата не выбрана</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('2017-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stageId"
          render={({ field }) => (
            <FormItem className="grid">
              <FormLabel className="text-left">
                {form.formState.errors.messageContent ? (
                  <p className="flex justify-between truncate">
                    Этап
                    <span className="w-full text-right text-xs font-light">
                      {form.formState.errors.messageContent.message}
                    </span>
                  </p>
                ) : (
                  'Этап'
                )}
              </FormLabel>
              <FormControl>
                {/* <Input
                  type="number"
                  placeholder="ID этапа"
                  {...field}
                  name="messageContent"
                /> */}

                {stageTypes && !isStageTypesLoading ? (
                  <Combobox
                    side="top"
                    className={cn(className)}
                    value={field?.value?.toString()}
                    onSelect={field.onChange}
                    items={stageTypes.map(
                      (item: { id: number; name: string; group: string }) => ({
                        value: item.id,
                        label: item.name,
                      }),
                    )}
                  />
                ) : (
                  <Skeleton className="h-6 w-full" />
                )}
              </FormControl>
            </FormItem>
          )}
        />

        {editStage && setEditStage ? (
          <div className="flex w-full items-center justify-between gap-2">
            <Button type="submit" className="flex-1" disabled={isUpdateLoading}>
              Сохранить
            </Button>
            <Button
              className="flex-1"
              type="button"
              variant={'outline'}
              disabled={isUpdateLoading}
              onClick={() => {
                setEditStage(null);
                form.reset(initialValues);
              }}
            >
              Отмена
            </Button>
          </div>
        ) : (
          <Button type="submit" className="w-full" disabled={isLoading}>
            Добавить этап
          </Button>
        )}
      </form>
    </Form>
  );
};

export { CreateStageForm };
