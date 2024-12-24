import {
  Button,
  cn,
  Form,
  selectEditStage,
  setEditStage,
  Skeleton,
} from '@urgp/client/shared';
import {
  controlStageCreateFormValues,
  ControlStageCreateFormValuesDto,
} from '@urgp/shared/entities';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  useCreateControlStage,
  useUpdateControlStage,
} from '../api/operationsApi';
import {
  OperationTypeSelector,
  useCurrentUserApprovers,
  useCurrentUserData,
  useOperationTypesFlat,
} from '../../classificators';
import {
  DateFormField,
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { useEffect, useMemo } from 'react';
import { StageHistoryItem } from './StagesList/StageHistoryItem';
import { useDispatch, useSelector } from 'react-redux';

type CreateStageFormProps = {
  caseId: number;
  className?: string;
  popoverMinWidth?: string;
};

const CreateStageForm = ({
  caseId,
  className,
  popoverMinWidth,
}: CreateStageFormProps): JSX.Element | null => {
  const { data: operationTypes, isLoading: isOperationTypesLoading } =
    useOperationTypesFlat();
  const { data: approvers, isLoading: isApproversLoading } =
    useCurrentUserApprovers();
  const { data: userData, isLoading: isUserDataLoading } = useCurrentUserData();
  const editStage = useSelector(selectEditStage);
  const dispatch = useDispatch();

  const emptyStage = useMemo(() => {
    return controlStageCreateFormValues.safeParse(
      !editStage || editStage === 'new'
        ? {
            type: 6,
            doneDate: new Date().setHours(0, 0, 0, 0),
            num: '',
            description: '',
            approver: userData?.approvers?.operations?.[0].toString(),
          }
        : {
            type: editStage?.payload?.type?.id,
            doneDate: editStage?.payload?.doneDate,
            num: editStage?.payload?.num?.toString(),
            description: editStage?.payload?.description?.toString(),
            approver: editStage?.payload?.approver?.id?.toString(),
          },
    ).data;
  }, [editStage, userData, isUserDataLoading]);

  const form = useForm<ControlStageCreateFormValuesDto>({
    resolver: zodResolver(controlStageCreateFormValues),
    defaultValues: emptyStage,
  });

  useEffect(() => {
    if (editStage) {
      form.reset(emptyStage);
    }
  }, [editStage, form]);

  const watchType = form.watch('type');

  useEffect(() => {
    if (
      operationTypes?.find((operation) => {
        return operation.id === watchType;
      })?.autoApprove
    ) {
      form.unregister('approver');
    } else {
      form.register('approver');
      userData?.approvers?.operations?.[0] &&
        // watchApprover === undefined &&
        form.setValue('approver', userData.approvers.operations[0]);
    }
  }, [form.register, form.unregister, watchType]);

  const [createStage, { isLoading: isCreateLoading }] = useCreateControlStage();
  const [updateStage, { isLoading: isUpdateLoading }] = useUpdateControlStage();

  async function onSubmit(data: ControlStageCreateFormValuesDto) {
    editStage && editStage !== 'new'
      ? updateStage({ ...data, id: editStage?.id || 0, type: undefined })
          .unwrap()
          .then(() => {
            form.reset(emptyStage);
            toast.success('Этап изменен');
            dispatch(setEditStage(null));
          })
          .catch((rejected: any) =>
            toast.error('Не удалось изменить этап', {
              description: rejected.data?.message || 'Неизвестная ошибка',
            }),
          )
      : createStage({ ...data, caseId })
          .unwrap()
          .then(() => {
            form.reset(emptyStage);
            toast.success('Этап добавлен');
            dispatch(setEditStage(null));
          })
          .catch((rejected: any) =>
            toast.error('Не удалось создать этап', {
              description: rejected.data?.message || 'Неизвестная ошибка',
            }),
          );
  }

  if (isUserDataLoading) {
    return <Skeleton className={cn('h-[314px] w-full', className)} />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-4', className)}
      >
        {editStage && editStage !== 'new' && (
          <StageHistoryItem
            item={{
              ...editStage.payload,
              class: editStage.class,
              id: editStage.id,
              caseId: editStage.caseId || 0,
            }}
            className="bg-amber-50"
          />
        )}
        <OperationTypeSelector
          form={form}
          fieldName={'type'}
          popoverMinWidth={popoverMinWidth}
          disabled={editStage !== 'new'}
        />
        <div className="flex w-full flex-row gap-4">
          <DateFormField
            form={form}
            fieldName={'doneDate'}
            label="Дата"
            placeholder="Дата документа"
            className="flex-shrink-0"
            dirtyIndicator={editStage ? true : false}
          />
          <InputFormField
            form={form}
            fieldName={'num'}
            label="Номер"
            placeholder="Номер документа"
            className="flex-grow"
            dirtyIndicator={editStage ? true : false}
          />
        </div>
        <TextAreaFormField
          form={form}
          fieldName={'description'}
          label="Описание"
          placeholder="Описание операции"
          dirtyIndicator={editStage ? true : false}
        />
        <SelectFormField
          form={form}
          fieldName={'approver'}
          options={approvers?.operations}
          isLoading={isApproversLoading || isOperationTypesLoading}
          label="Согласующий"
          placeholder="Выбор согласующего"
          popoverMinWidth={popoverMinWidth}
          dirtyIndicator={editStage ? true : false}
          className={cn(
            operationTypes?.find((operation) => {
              return operation.id === watchType;
            })?.autoApprove && 'hidden',
          )}
        />

        <div className="flex w-full items-center justify-between gap-2">
          <Button
            className="flex-1"
            type="button"
            variant={'outline'}
            disabled={isCreateLoading || isUpdateLoading}
            onClick={() => {
              form.reset(emptyStage);
              dispatch(setEditStage(null));
            }}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isCreateLoading || isUpdateLoading}
          >
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { CreateStageForm };
