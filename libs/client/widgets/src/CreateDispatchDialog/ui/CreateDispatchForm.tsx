import {
  Button,
  cn,
  Form,
  guestUser,
  selectCurrentUser,
  selectEditDispatch,
  setEditDispatch,
  Skeleton,
} from '@urgp/client/shared';
import {
  dispatchCreateFormValues,
  DispatchCreateFormValuesDto,
  dispatchUpdate,
  dispatchUpdateFormValues,
  DispatchUpdateFormValuesDto,
  GET_DEFAULT_CONTROL_DUE_DATE,
} from '@urgp/shared/entities';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  DateFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { useEffect, useMemo, useState } from 'react';
import {
  useControlExecutors,
  useCreateDispatch,
  useDeleteOperation,
  useUpdateDispatch,
} from '@urgp/client/entities';
import { Save, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { endOfYesterday, isAfter, isBefore } from 'date-fns';

type CreateDispatchFormProps = {
  caseId: number;
  className?: string;
  popoverMinWidth?: string;
};

const CreateDispatchForm = ({
  caseId,
  className,
  popoverMinWidth,
}: CreateDispatchFormProps): JSX.Element | null => {
  const { data: executors, isLoading: isExecutorsLoading } =
    useControlExecutors();

  const editControlDispatch = useSelector(selectEditDispatch);
  const dispatch = useDispatch();
  const isEdit = editControlDispatch && editControlDispatch !== 'new';
  const user = useSelector(selectCurrentUser) || guestUser;

  const emptyDispatch = useMemo(() => {
    return !isEdit
      ? ({
          id: 0,
          executorId: null,
          description: '',
          dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
          dateDescription: 'Первично установленный срок',
          controller: 'executor',
        } as DispatchCreateFormValuesDto)
      : dispatchCreateFormValues.safeParse({
          id: editControlDispatch?.id,
          executorId: editControlDispatch?.payload?.executor?.id,
          description: editControlDispatch?.payload?.description?.toString(),
          dueDate: editControlDispatch?.payload?.dueDate,
          dateDescription: 'Без переноса срока',
          controller:
            editControlDispatch?.payload?.controller?.id === user?.id
              ? 'author'
              : 'executor',
        }).data;
  }, [executors, editControlDispatch]);

  const form = useForm<
    DispatchCreateFormValuesDto | DispatchUpdateFormValuesDto
  >({
    resolver: zodResolver(dispatchCreateFormValues),
    defaultValues: emptyDispatch,
  });

  // const watchExecutor = form.watch('executorId');
  const watchDueDate = form.watch('dueDate');
  const controllerList = useMemo(() => {
    return [
      { value: 'author', label: 'Оставить контроль за собой' },
      { value: 'executor', label: 'Оставить на контроле исполнителя' },
    ];
  }, [executors]);

  const [createDispatch, { isLoading: isCreateLoading }] = useCreateDispatch();
  const [updateDispatch, { isLoading: isUpdateLoading }] = useUpdateDispatch();
  const [deleteDispatch, { isLoading: isDeleteLoading }] = useDeleteOperation();
  const isLoading = isCreateLoading || isUpdateLoading || isDeleteLoading;

  async function onCreate(data: DispatchCreateFormValuesDto) {
    createDispatch({
      ...data,
      caseId,
      class: 'dispatch',
      typeId: 10,
      controllerId: data.controller === 'author' ? user.id : data.executorId,
    })
      .unwrap()
      .then(() => {
        form.reset(emptyDispatch);
        toast.success('Поручение создано');
        dispatch(setEditDispatch(null));
      })
      .catch((rejected: any) =>
        toast.error('Не удалось создать поручение', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  }

  async function onEdit(data: DispatchUpdateFormValuesDto) {
    console.log(data.dateDescription);
    editControlDispatch !== 'new' &&
      updateDispatch({
        ...data,
        dateDescription:
          data.dateDescription ||
          (data.dueDate === editControlDispatch?.payload.dueDate
            ? 'Корректировка без уточнения срока'
            : ''),
        id: editControlDispatch?.id || 0,
        class: 'dispatch',
      })
        .unwrap()
        .then(() => {
          form.reset(emptyDispatch);
          toast.success('Поручение изменено');
          dispatch(setEditDispatch(null));
        })
        .catch((rejected: any) =>
          toast.error('Не удалось изменить поручение', {
            description: rejected.data?.message || 'Неизвестная ошибка',
          }),
        );
  }
  async function onSubmit(
    data: DispatchCreateFormValuesDto | DispatchUpdateFormValuesDto,
  ) {
    isEdit
      ? onEdit(data as DispatchUpdateFormValuesDto)
      : onCreate(data as DispatchCreateFormValuesDto);
    form.reset(emptyDispatch);
    dispatch(setEditDispatch(null));
  }

  useEffect(() => {
    form.reset(emptyDispatch);
  }, [executors, isExecutorsLoading, editControlDispatch]);

  const [dateChanged, setDateChanged] = useState(false);
  useEffect(() => {
    if (!isEdit) return;
    const needDescription =
      new Date(watchDueDate || 0).setHours(0, 0, 0, 0) !==
      new Date(editControlDispatch?.payload?.dueDate || 0).setHours(0, 0, 0, 0);
    setDateChanged(needDescription);
    form.setValue(
      'dateDescription',
      needDescription ? '' : 'Без переноса срока',
    );
  }, [watchDueDate, isEdit]);

  if (isExecutorsLoading) {
    return <Skeleton className={cn('h-[314px] w-full', className)} />;
  }

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-4', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex w-full flex-row gap-2">
          <SelectFormField
            form={form}
            fieldName={'executorId'}
            options={executors}
            label="Исполнитель"
            placeholder="Выбор адресата поручения"
            popoverMinWidth={popoverMinWidth}
            valueType="number"
            className="flex-grow"
            dirtyIndicator={!!isEdit}
          />
          <DateFormField
            form={form}
            fieldName={'dueDate'}
            label="Срок решения"
            placeholder="Контрольный срок"
            className={cn('flex-shrink-0')}
            dirtyIndicator={!!isEdit}
            disabledDays={(date) => isBefore(date, endOfYesterday())}
          />
        </div>
        <SelectFormField
          form={form}
          fieldName={'controller'}
          options={controllerList}
          label="Контроль"
          placeholder="За кем останется контроль"
          popoverMinWidth={popoverMinWidth}
          valueType="string"
          className={cn('flex-grow')}
          disabled={!!isEdit}
        />
        <TextAreaFormField
          form={form}
          fieldName={'description'}
          label="Комментарий"
          placeholder="Комментарий к поручению"
          dirtyIndicator={!!isEdit}
        />
        <TextAreaFormField
          form={form}
          fieldName={'dateDescription'}
          label="Причина переноса срока"
          placeholder="Комментарий к изменению срока поручения"
          className={cn(dateChanged ? '' : 'hidden')}
          // dirtyIndicator={!!isEdit}
        />
        <div className="flex w-full items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-grow"
            disabled={isLoading}
            onClick={() => {
              form.reset(emptyDispatch);
              dispatch(setEditDispatch(null));
            }}
          >
            Отмена
          </Button>
          {!!isEdit && (
            <Button
              type="button"
              variant="destructive"
              className="flex flex-grow flex-row gap-2"
              onClick={() => {
                deleteDispatch({ id: editControlDispatch?.id || 0 })
                  .unwrap()
                  .then(() => {
                    form.reset(emptyDispatch);
                    toast.success('Поручение удалено');
                    dispatch(setEditDispatch(null));
                  })
                  .catch((rejected: any) =>
                    toast.error('Не удалось удалить поручение', {
                      description:
                        rejected.data?.message || 'Неизвестная ошибка',
                    }),
                  );
                form.reset(emptyDispatch);
                dispatch(setEditDispatch(null));
              }}
              disabled={isLoading}
            >
              <Trash className="size-5" />
              <span>Удалить поручение</span>
            </Button>
          )}
          <Button
            type="submit"
            variant="default"
            className="flex flex-grow flex-row gap-2"
            disabled={isLoading}
          >
            <Save className="size-5" />
            <span>Сохранить</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { CreateDispatchForm };
