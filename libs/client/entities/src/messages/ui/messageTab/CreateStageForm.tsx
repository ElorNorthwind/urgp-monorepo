import {
  Badge,
  Button,
  Calendar,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
  useStageGroups,
  useUpdateStage,
} from '../../api/stagesApi';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';

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
  docNumber: '',
  stageId: 0,
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
  const { data: stageGroups, isLoading: isStageGroupsLoading } =
    useStageGroups();

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
        <FormField
          control={form.control}
          name="stageId"
          render={({ field }) => (
            <FormItem className="grid">
              <FormLabel className="text-left">
                {form.formState.errors.stageId ? (
                  <p className="flex justify-between truncate">
                    Этап
                    <span className="w-full text-right text-xs font-light">
                      {form.formState.errors.stageId.message}
                    </span>
                  </p>
                ) : (
                  'Этап'
                )}
              </FormLabel>
              {!stageGroups || isStageGroupsLoading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between overflow-hidden',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          <div className="-ml-1 flex w-[calc(100%-1.5rem)] items-center justify-start gap-2">
                            <Badge variant={'outline'}>
                              {
                                stageGroups.find((group) =>
                                  group.items.some(
                                    (item) => field.value === item.value,
                                  ),
                                )?.label
                              }
                            </Badge>
                            <p className="truncate">
                              {
                                stageGroups
                                  .find((group) =>
                                    group.items.some(
                                      (item) => field.value === item.value,
                                    ),
                                  )
                                  ?.items.find(
                                    (item) => item.value === field.value,
                                  )?.label
                              }
                            </p>
                          </div>
                        ) : (
                          'Этап не выбран'
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[calc(var(--messagebar-width)-1.25rem)] p-0"
                    side="top"
                  >
                    <Command
                      filter={(value, search, keywords) => {
                        const extendValue = (
                          keywords ? value + ' ' + keywords.join(' ') : value
                        ).toLowerCase();
                        if (extendValue.includes(search.toLowerCase()))
                          return 1;
                        return 0;
                      }}
                    >
                      <CommandInput placeholder="Поиск этапов..." />
                      <CommandList>
                        <CommandEmpty>Этап не найден.</CommandEmpty>
                        {stageGroups.map((group) => {
                          return (
                            <CommandGroup
                              key={group.value}
                              heading={group.label}
                            >
                              {group.items.map((stage) => {
                                return (
                                  <CommandItem
                                    value={stage.label}
                                    key={stage.value}
                                    keywords={[group.label || '']}
                                    onSelect={() => {
                                      form.setValue('stageId', stage.value);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        stage.value === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                    {stage.label}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          );
                        })}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </FormItem>
          )}
        />

        <div className="flex w-full flex-row gap-4">
          <FormField
            control={form.control}
            name="docDate"
            render={({ field }) => (
              <FormItem className="grid">
                <FormLabel className="text-left">
                  {form.formState.errors.docDate ? (
                    <p className="flex justify-between truncate">
                      Дата документа
                      <span className="w-full text-right text-xs font-light">
                        {form.formState.errors.docDate.message}
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
                          'w-32 justify-start text-left font-normal',
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
                    <PopoverContent
                      className="h-[21.5rem] w-auto p-0"
                      side="top"
                    >
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
            name="docNumber"
            render={({ field }) => (
              <FormItem className="grid w-full">
                <FormLabel className="text-left">
                  {form.formState.errors.docNumber ? (
                    <p className="flex justify-between truncate">
                      Номер документа
                      <span className="w-full text-right text-xs font-light">
                        {form.formState.errors.docNumber.message}
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
        </div>

        <FormField
          control={form.control}
          name="messageContent"
          render={({ field }) => (
            <FormItem className="grid">
              {/* <FormLabel className="text-left">
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
              </FormLabel> */}
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
