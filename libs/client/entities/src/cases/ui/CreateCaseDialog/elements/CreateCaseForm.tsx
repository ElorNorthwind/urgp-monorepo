import {
  Button,
  cn,
  Form,
  selectCaseFormState,
  selectCurrentUser,
  setCaseFormState,
  setCaseFormValuesEmpty,
  Skeleton,
} from '@urgp/client/shared';
import {
  CaseCreateDto,
  CaseFormValuesDto,
  CaseUpdateDto,
} from '@urgp/shared/entities';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import {
  DateFormField,
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { useCreateCase, useUpdateCase } from '../../../api/casesApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  CaseTypeSelector,
  DirectionTypeSelector,
  useCurrentUserApprovers,
} from '../../../../classificators';
import { ExternalCaseFieldArray } from './ExternalCaseFieldArray';

type CreateCaseFormProps = {
  form: UseFormReturn<CaseFormValuesDto, any, undefined>;
  className?: string;
  popoverMinWidth?: string;
};

const CreateCaseForm = ({
  form,
  className,
  popoverMinWidth,
}: CreateCaseFormProps): JSX.Element | null => {
  const formState = useSelector(selectCaseFormState);
  const isEdit = formState === 'edit';
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const watchApprover = form.watch('approverId');

  const [createCase, { isLoading: isCreateLoading }] = useCreateCase();
  const [updateCase, { isLoading: isUpdateLoading }] = useUpdateCase();

  const { data: approvers, isLoading: isApproversLoading } =
    useCurrentUserApprovers();

  const closeAndReset = () => {
    dispatch(setCaseFormValuesEmpty()); // Сбрасываем стейт в состояние пустого
    dispatch(setCaseFormState('close')); // Закрываем форму (диалог)
    // form.reset(emptyCase); // Ресетаем форму (не нужно на самом деле)
  };

  // const form = useForm<CaseCreateFormValuesDto>({
  //   resolver: zodResolver(caseCreateFormValues),
  //   defaultValues: emptyCase,
  // });

  async function onSubmit(data: CaseFormValuesDto) {
    isEdit
      ? updateCase({ ...data, class: 'control-incident' } as CaseUpdateDto)
          .unwrap()
          .then(() => {
            toast.success('Заявка изменена');
            closeAndReset();
          })
          .catch((rejected: any) =>
            toast.error('Не удалось изменить заявку', {
              description: rejected.data?.message || 'Неизвестная ошибка',
            }),
          )
      : createCase({ ...data, class: 'control-incident' } as CaseCreateDto)
          .unwrap()
          .then(() => {
            toast.success('Заявка добавлена');
            closeAndReset();
          })
          .catch((rejected: any) =>
            toast.error('Не удалось создать заявку', {
              description: rejected.data?.message || 'Неизвестная ошибка',
            }),
          );
  }

  if (isApproversLoading) {
    return <Skeleton className={cn('h-[550px] w-full', className)} />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-4', className)}
      >
        <CaseTypeSelector
          form={form}
          label="Тип"
          placeholder="Тип заявки"
          fieldName="typeId"
          popoverMinWidth={popoverMinWidth}
          // popoverMinWidth={'405px'} // oh that's not good
          dirtyIndicator={isEdit}
          // className="flex-grow"
        />

        <DirectionTypeSelector
          form={form}
          label="Направления"
          placeholder="Направления работы"
          fieldName="directionIds"
          dirtyIndicator={isEdit}
        />
        <ExternalCaseFieldArray form={form} fieldArrayName="externalCases" />
        <div className="flex w-full flex-row gap-2">
          <InputFormField
            form={form}
            fieldName={'fio'}
            label="Заявитель"
            placeholder="ФИО заявителя"
            className="flex-grow"
            dirtyIndicator={isEdit}
          />
          <InputFormField
            form={form}
            fieldName={'adress'}
            label="Адрес"
            placeholder="Адрес заявителя"
            className="flex-grow"
            dirtyIndicator={isEdit}
          />
        </div>
        <TextAreaFormField
          form={form}
          fieldName={'description'}
          label="Описание"
          placeholder="Описание проблемы"
          dirtyIndicator={isEdit}
        />
        <div className="flex w-full flex-row gap-2">
          <SelectFormField
            form={form}
            fieldName={'approverId'}
            options={approvers?.operations}
            label="Согласующий"
            placeholder="Выбор согласующего"
            popoverMinWidth={popoverMinWidth}
            dirtyIndicator={isEdit}
            valueType="number"
            className="flex-grow"
          />
          <DateFormField
            form={form}
            fieldName={'dueDate'}
            label="Срок решения"
            placeholder="Контрольный срок"
            disabled={isEdit || user?.id !== watchApprover}
            className={cn(
              'flex-shrink-0',
              (user?.id !== watchApprover || user?.id !== watchApprover) &&
                'hidden',
            )}
          />
        </div>
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

export { CreateCaseForm };
