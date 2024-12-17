import {
  Button,
  cn,
  Form,
  selectCurrentUser,
  Skeleton,
} from '@urgp/client/shared';
import {
  ControlStage,
  controlStageCreateFormValues,
  ControlStageCreateFormValuesDto,
} from '@urgp/shared/entities';
import { useSelector } from 'react-redux';
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

type CreateStageFormProps = {
  caseId: number;
  className?: string;
  widthClassName?: string;
  onClose?: () => void;
  editStage?: ControlStage | null;
  setEditStage?: React.Dispatch<React.SetStateAction<ControlStage | null>>;
};

const CreateStageForm = ({
  caseId,
  className,
  widthClassName,
  onClose,
  editStage,
  setEditStage,
}: CreateStageFormProps): JSX.Element | null => {
  const { data: operationTypes, isLoading: isOperationTypesLoading } =
    useOperationTypesFlat();
  const { data: approvers, isLoading: isApproversLoading } =
    useCurrentUserApprovers();
  const { data: userData, isLoading: isUserDataLoading } = useCurrentUserData();

  const emptyStage = useMemo(() => {
    return {
      type: 6,
      doneDate: new Date(),
      num: '',
      description: undefined,
      approver: userData?.approvers?.operations?.[0],
    };
  }, [userData, isUserDataLoading]);

  const form = useForm<ControlStageCreateFormValuesDto>({
    resolver: zodResolver(controlStageCreateFormValues),
    defaultValues: emptyStage,
  });

  useEffect(() => {
    if (editStage) {
      form.reset({ ...editStage, approver: editStage?.approver?.id });
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
      userData?.approvers?.operations?.[0] &&
        form.getValues('approver') === null &&
        form.setValue('approver', userData.approvers.operations[0]);
      form.register('approver');
    }
  }, [form.register, form.unregister, watchType]);

  const [createStage, { isLoading: isCreateLoading }] = useCreateControlStage();
  const [updateStage, { isLoading: isUpdateLoading }] = useUpdateControlStage();

  async function onSubmit(data: ControlStageCreateFormValuesDto) {
    editStage
      ? updateStage({ ...data, id: editStage?.id || 0 })
          .unwrap()
          .then(() => {
            form.reset(emptyStage);
            toast.success('Этап изменен');
            setEditStage && setEditStage(null);
            onClose && onClose();
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
            onClose && onClose();
          })
          .catch((rejected: any) =>
            toast.error('Не удалось создать этап', {
              description: rejected.data?.message || 'Неизвестная ошибка',
            }),
          );
  }

  if (isUserDataLoading) {
    return <Skeleton className="h-8 w-full" />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-4', className, widthClassName)}
      >
        <OperationTypeSelector
          form={form}
          fieldName={'type'}
          popoverClassName={widthClassName}
        />
        <div className="flex w-full flex-row gap-4">
          <DateFormField
            form={form}
            fieldName={'doneDate'}
            label="Дата"
            placeholder="Дата документа"
            className="flex-shrink-0"
          />
          <InputFormField
            form={form}
            fieldName={'label'}
            label="Номер"
            placeholder="Номер документа"
            className="flex-grow"
          />
        </div>
        <TextAreaFormField
          form={form}
          fieldName={'description'}
          label="Описание"
          placeholder="Описание операции"
        />
        <SelectFormField
          form={form}
          fieldName={'approver'}
          options={approvers?.operations}
          isLoading={isApproversLoading || isOperationTypesLoading}
          label="Согласующий"
          placeholder="Выбор согласующего"
          popoverClassName={widthClassName}
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
              onClose && onClose();
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
