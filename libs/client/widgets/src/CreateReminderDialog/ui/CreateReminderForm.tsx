import {
  Button,
  cn,
  Form,
  guestUser,
  selectCurrentUser,
  selectEditDispatch,
  selectEditReminder,
  setEditDispatch,
  setEditReminder,
  Skeleton,
} from '@urgp/client/shared';
import {
  ControlReminder,
  dispatchCreateFormValues,
  DispatchCreateFormValuesDto,
  GET_DEFAULT_CONTROL_DUE_DATE,
  ReminderCreateDto,
  reminderCreateFormValues,
  ReminderCreateFormValuesDto,
  ReminderUpdateDto,
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
  useCreateReminder,
  useDeleteOperation,
  useUpdateDispatch,
  useUpdateReminder,
} from '@urgp/client/entities';
import { Bed, EyeOff, Save, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { endOfYesterday, format, isBefore } from 'date-fns';

type CreateReminderFormProps = {
  caseId: number;
  className?: string;
  expectedDueDate?: Date;
};

const CreateReminderForm = ({
  caseId,
  className,
  expectedDueDate,
}: CreateReminderFormProps): JSX.Element | null => {
  const editReminder = useSelector(selectEditReminder);
  const dispatch = useDispatch();
  const isEdit = editReminder && editReminder !== 'new';
  const user = useSelector(selectCurrentUser) || guestUser;

  const emptyReminder = useMemo(() => {
    return !isEdit
      ? ({
          id: 0,
          caseId,
          class: 'reminder',
          typeId: 11,
          observerId: user?.id || 0,
          description: '',
          dueDate: expectedDueDate || GET_DEFAULT_CONTROL_DUE_DATE(),
          doneDate: null,
        } as ReminderCreateDto)
      : ({
          id: editReminder?.id,
          caseId: editReminder?.caseId || caseId,
          class: editReminder?.class || 'reminder',
          // typeId: editReminder?.payload?.type?.id || 11,
          observerId: editReminder?.payload?.observer?.id || user?.id || 0,
          description: editReminder?.payload?.description || '',
          dueDate:
            editReminder?.payload?.dueDate ||
            expectedDueDate ||
            GET_DEFAULT_CONTROL_DUE_DATE(),
          doneDate: null,
        } as unknown as ReminderUpdateDto);
  }, [editReminder]);

  const form = useForm<ReminderCreateFormValuesDto>({
    resolver: zodResolver(reminderCreateFormValues),
    defaultValues: emptyReminder,
  });

  const [createReminder, { isLoading: isCreateLoading }] = useCreateReminder();
  const [updateReminder, { isLoading: isUpdateLoading }] = useUpdateReminder();
  const isLoading = isCreateLoading || isUpdateLoading;

  async function onCreate(data: ReminderCreateFormValuesDto) {
    createReminder({
      ...(emptyReminder as ReminderCreateDto),
      ...data,
    })
      .unwrap()
      .then(() => {
        form.reset(emptyReminder);
        toast.success('Напоминание создано');
        dispatch(setEditReminder(null));
      })
      .catch((rejected: any) =>
        toast.error('Не удалось создать напоминание', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  }

  async function onEdit(data: ReminderCreateFormValuesDto) {
    editReminder !== 'new' &&
      updateReminder({
        ...(emptyReminder as ReminderUpdateDto),
        ...data,
        doneDate: null,
      })
        .unwrap()
        .then(() => {
          form.reset(emptyReminder);
          toast.success('Напоминание изменено');
          dispatch(setEditReminder(null));
        })
        .catch((rejected: any) =>
          toast.error('Не удалось изменить напоминание', {
            description: rejected.data?.message || 'Неизвестная ошибка',
          }),
        );
  }

  async function onMarkAsDone(data: ReminderCreateFormValuesDto) {
    editReminder !== 'new' &&
      updateReminder({
        ...(emptyReminder as ReminderUpdateDto),
        ...data,
        doneDate: new Date(),
      })
        .unwrap()
        .then(() => {
          form.reset(emptyReminder);
          toast.success('Напоминание снято');
          dispatch(setEditReminder(null));
        })
        .catch((rejected: any) =>
          toast.error('Не удалось снять напоминание', {
            description: rejected.data?.message || 'Неизвестная ошибка',
          }),
        );
  }

  async function onSubmit(data: ReminderCreateFormValuesDto) {
    isEdit ? onEdit(data) : onCreate(data);
    form.reset(emptyReminder);
    dispatch(setEditReminder(null));
  }

  useEffect(() => {
    form.reset(emptyReminder);
  }, [editReminder]);

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-4', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex w-full flex-row items-end gap-2">
          <DateFormField
            form={form}
            fieldName={'dueDate'}
            label="Дата напоминания"
            placeholder="Напомнить в срок"
            className={cn('ml-autoflex-shrink-0')}
            dirtyIndicator={!!isEdit}
            disabledDays={(date) => isBefore(date, endOfYesterday())}
          />
          {!!isEdit && editReminder?.payload?.doneDate && (
            <div className="bg-muted-foreground/5 ml-auto flex flex-row items-center gap-2 rounded border px-4 py-2 text-right">
              <span className="font-semibold">Напоминание снято</span>
              <span className="">
                {format(editReminder?.payload?.doneDate, 'dd.MM.yyyy')}
              </span>
            </div>
          )}
        </div>
        <TextAreaFormField
          form={form}
          fieldName={'description'}
          label="Комментарий"
          placeholder="Комментарий к напоминанию"
          dirtyIndicator={!!isEdit}
        />
        <div className="flex w-full items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-grow"
            disabled={isLoading}
            onClick={() => {
              form.reset(emptyReminder);
              dispatch(setEditReminder(null));
            }}
          >
            Отмена
          </Button>
          {!!isEdit && !editReminder?.payload?.doneDate && (
            <Button
              type="button"
              variant="destructive"
              className="flex flex-grow flex-row gap-2"
              onClick={() => {
                onMarkAsDone(form.getValues());
                form.reset(emptyReminder);
                dispatch(setEditDispatch(null));
              }}
              disabled={isLoading}
            >
              <EyeOff className="size-5" />
              <span>Снять напоминание</span>
            </Button>
          )}
          <Button
            type="submit"
            variant="default"
            className="flex flex-grow flex-row gap-2"
            disabled={isLoading}
          >
            <Save className="size-5" />
            <span>
              {!!isEdit && editReminder?.payload?.doneDate
                ? 'Вернуть напоминание'
                : 'Сохранить'}
            </span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { CreateReminderForm };
