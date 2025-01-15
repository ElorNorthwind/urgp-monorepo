import {
  Button,
  cn,
  Form,
  selectCurrentUser,
  selectEditCase,
  setEditCase,
  Skeleton,
} from '@urgp/client/shared';
import {
  Case,
  caseCreateFormValues,
  CaseCreateFormValuesDto,
  GET_DEFAULT_CONTROL_DUE_DATE,
} from '@urgp/shared/entities';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  DateFormField,
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { useEffect, useMemo } from 'react';
import { useCreateCase, useUpdateCase } from '../../api/casesApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  CaseTypeSelector,
  DirectionTypeSelector,
  useCurrentUserApprovers,
} from '../../../classificators';
import { ExternalCaseFieldArray } from './ExternalCaseFieldArray';

type CreateCaseFormProps = {
  className?: string;
  popoverMinWidth?: string;
};

const CreateCaseForm = ({
  className,
  popoverMinWidth,
}: CreateCaseFormProps): JSX.Element | null => {
  const { data: approvers, isLoading: isApproversLoading } =
    useCurrentUserApprovers();

  const editCase = useSelector(selectEditCase);
  const dispatch = useDispatch();

  const emptyCase = useMemo(() => {
    return !editCase || editCase === 'new'
      ? {
          class: 'control-incident',
          typeId: 4,
          externalCases: [
            {
              system: 'NONE',
              num: '',
              date: new Date(),
            } as Case['payload']['externalCases'][0],
          ],
          directionIds: [],
          problemIds: [],
          description: '',
          fio: '',
          adress: '',
          approverId: approvers?.operations?.[0].value,
          dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
        }
      : caseCreateFormValues.safeParse({
          class: editCase?.class,
          typeId: editCase?.payload?.type?.id,
          externalCases: editCase?.payload?.externalCases,
          directionIds: editCase?.payload?.directions?.map((d) => d?.id),
          problemIds: editCase?.payload?.problems?.map((p) => p?.id),
          description: editCase?.payload?.description,
          fio: editCase?.payload?.fio,
          adress: editCase?.payload?.adress,
          approverId: editCase?.payload?.approver?.id,
        }).data;
  }, [editCase, approvers]);

  const form = useForm<CaseCreateFormValuesDto>({
    resolver: zodResolver(caseCreateFormValues),
    defaultValues: emptyCase,
  });

  const user = useSelector(selectCurrentUser);
  const watchApprover = form.watch('approverId');

  useEffect(() => {
    if (editCase) {
      form.reset(emptyCase);
    }
  }, [editCase, form, approvers, isApproversLoading]);

  const [createCase, { isLoading: isCreateLoading }] = useCreateCase();
  const [updateCase, { isLoading: isUpdateLoading }] = useUpdateCase();

  async function onSubmit(data: CaseCreateFormValuesDto) {
    editCase && editCase !== 'new'
      ? updateCase({ ...data, id: editCase?.id || 0 })
          .unwrap()
          .then(() => {
            form.reset(emptyCase);
            toast.success('Заявка изменена');
            dispatch(setEditCase(null));
          })
          .catch((rejected: any) =>
            toast.error('Не удалось изменить заявку', {
              description: rejected.data?.message || 'Неизвестная ошибка',
            }),
          )
      : createCase({ ...data, class: 'control-incident' })
          .unwrap()
          .then(() => {
            form.reset(emptyCase);
            toast.success('Заявка добавлена');
            dispatch(setEditCase(null));
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
          dirtyIndicator={editCase !== 'new'}
          // className="flex-grow"
        />

        <DirectionTypeSelector
          form={form}
          label="Направления"
          placeholder="Направления работы"
          fieldName="directionIds"
          dirtyIndicator={editCase !== 'new'}
        />
        <ExternalCaseFieldArray form={form} fieldArrayName="externalCases" />
        <div className="flex w-full flex-row gap-2">
          <InputFormField
            form={form}
            fieldName={'fio'}
            label="Заявитель"
            placeholder="ФИО заявителя"
            className="flex-grow"
            dirtyIndicator={editCase !== 'new'}
          />
          <InputFormField
            form={form}
            fieldName={'adress'}
            label="Адрес"
            placeholder="Адрес заявителя"
            className="flex-grow"
            dirtyIndicator={editCase !== 'new'}
          />
        </div>
        <TextAreaFormField
          form={form}
          fieldName={'description'}
          label="Описание"
          placeholder="Описание проблемы"
          dirtyIndicator={editCase !== 'new'}
        />
        <div className="flex w-full flex-row gap-2">
          <SelectFormField
            form={form}
            fieldName={'approverId'}
            options={approvers?.operations}
            isLoading={isApproversLoading}
            label="Согласующий"
            placeholder="Выбор согласующего"
            popoverMinWidth={popoverMinWidth}
            dirtyIndicator={editCase !== 'new'}
            valueType="number"
            className="flex-grow"
          />
          <DateFormField
            form={form}
            fieldName={'dueDate'}
            label="Срок решения"
            placeholder="Контрольный срок"
            disabled={editCase !== 'new' || user?.id !== watchApprover}
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
            onClick={() => {
              form.reset(emptyCase);
              dispatch(setEditCase(null));
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

export { CreateCaseForm };
