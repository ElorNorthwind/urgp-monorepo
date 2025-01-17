import {
  Button,
  cn,
  Form,
  selectCurrentUser,
  selectStageFormState,
  selectStageFormValues,
  setStageFormState,
  setStageFormValuesEmpty,
  Skeleton,
} from '@urgp/client/shared';

import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import {
  useCreateControlStage,
  useStages,
  useUpdateControlStage,
} from '../../../api/operationsApi';
import {
  OperationTypeSelector,
  useCurrentUserApprovers,
  useOperationTypesFlat,
} from '../../../../classificators';
import {
  DateFormField,
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { StageHistoryItem } from '../../StagesList/StageHistoryItem';
import { useDispatch, useSelector } from 'react-redux';
import {
  ControlStageFormValuesDto,
  ControlStageUpdateDto,
} from '@urgp/shared/entities';

type CreateStageFormProps = {
  form: UseFormReturn<ControlStageFormValuesDto, any, undefined>;
  className?: string;
  popoverMinWidth?: string;
};

const CreateStageForm = ({
  form,
  className,
  popoverMinWidth,
}: CreateStageFormProps): JSX.Element | null => {
  const { data: operationTypes, isLoading: isOperationTypesLoading } =
    useOperationTypesFlat();
  const { data: approvers, isLoading: isApproversLoading } =
    useCurrentUserApprovers();

  const formState = useSelector(selectStageFormState);
  const isEdit = formState === 'edit';
  const initialValues = useSelector(selectStageFormValues);
  const { data: stages, isLoading: isStagesLoading } = useStages(
    initialValues?.id || 0,
    { skip: !isEdit || !initialValues?.id },
  );
  const editStage = stages?.find((stage) => stage.id === initialValues?.id);

  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const watchType = form.watch('typeId');

  const [createStage, { isLoading: isCreateLoading }] = useCreateControlStage();
  const [updateStage, { isLoading: isUpdateLoading }] = useUpdateControlStage();

  const closeAndReset = () => {
    dispatch(setStageFormValuesEmpty()); // Сбрасываем стейт в состояние пустого
    dispatch(setStageFormState('close')); // Закрываем форму (диалог)
  };

  async function onSubmit(data: ControlStageFormValuesDto) {
    isEdit
      ? updateStage({
          ...data,
          class: 'stage',
          approverId: operationTypes?.find((operation) => {
            return operation.id === form.getValues('typeId');
          })?.autoApprove
            ? null
            : data.approverId,
        } as ControlStageUpdateDto)
          .unwrap()
          .then(() => {
            toast.success('Этап изменен');
            closeAndReset();
          })
          .catch((rejected: any) =>
            toast.error('Не удалось изменить этап', {
              description: rejected.data?.message || 'Неизвестная ошибка',
            }),
          )
      : createStage({ ...data, class: 'stage' })
          .unwrap()
          .then(() => {
            toast.success('Этап добавлен');
            closeAndReset();
          })
          .catch((rejected: any) =>
            toast.error('Не удалось создать этап', {
              description: rejected.data?.message || 'Неизвестная ошибка',
            }),
          );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-4', className)}
      >
        {isEdit &&
          (isStagesLoading ? (
            <Skeleton />
          ) : editStage ? (
            <StageHistoryItem
              item={{
                ...editStage.payload,
                class: editStage.class,
                id: editStage.id,
                caseId: editStage.caseId || 0,
              }}
              className="bg-amber-50"
            />
          ) : null)}
        <OperationTypeSelector
          form={form}
          fieldName={'typeId'}
          popoverMinWidth={popoverMinWidth}
          disabled={isEdit}
        />
        <div className="flex w-full flex-row gap-4">
          <DateFormField
            form={form}
            fieldName={'doneDate'}
            label="Дата"
            placeholder="Дата документа"
            className="flex-shrink-0"
            dirtyIndicator={isEdit}
          />
          <InputFormField
            form={form}
            fieldName={'num'}
            label="Номер"
            placeholder="Номер документа"
            className="flex-grow"
            dirtyIndicator={isEdit}
          />
        </div>
        <TextAreaFormField
          form={form}
          fieldName={'description'}
          label="Описание"
          placeholder="Описание операции"
          dirtyIndicator={isEdit}
        />
        <SelectFormField
          form={form}
          fieldName={'approverId'}
          options={approvers?.operations}
          isLoading={isApproversLoading || isOperationTypesLoading}
          label="Согласующий"
          placeholder="Выбор согласующего"
          popoverMinWidth={popoverMinWidth}
          dirtyIndicator={isEdit}
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
            onClick={closeAndReset}
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
