import {
  Button,
  cn,
  Form,
  selectCurrentUser,
  selectEditCase,
  setEditCase,
  Skeleton,
  useUserAbility,
} from '@urgp/client/shared';
import {
  Case,
  caseCreateFormValues,
  CaseCreateFormValuesDto,
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
import { addBusinessDays } from 'date-fns';
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
          type: 4,
          externalCases: [
            {
              system: 'NONE',
              num: '',
              date: new Date(),
            } as Case['payload']['externalCases'][0],
          ],
          directions: [],
          problems: [],
          description: '',
          fio: '',
          adress: '',
          approver: approvers?.operations?.[0].value,
          dueDate: addBusinessDays(new Date().setHours(0, 0, 0, 0), 5),
        }
      : caseCreateFormValues.safeParse({
          class: editCase?.class,
          type: editCase?.payload?.type?.id,
          externalCases: editCase?.payload?.externalCases,
          directions: editCase?.payload?.directions?.map((d) => d.id),
          problems: editCase?.payload?.problems?.map((p) => p.id),
          description: editCase?.payload?.description,
          fio: editCase?.payload?.fio,
          adress: editCase?.payload?.adress,
          approver: editCase?.payload?.approver?.id,
        }).data;
  }, [editCase, approvers]);

  const form = useForm<CaseCreateFormValuesDto>({
    resolver: zodResolver(caseCreateFormValues),
    defaultValues: emptyCase,
  });

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
        <div className="flex w-full flex-row gap-2">
          <CaseTypeSelector
            form={form}
            label="Тип"
            placeholder="Тип заявки"
            fieldName="type"
            popoverMinWidth={'405px'} // oh that's not good
            dirtyIndicator={editCase !== 'new'}
            className="flex-grow"
          />
          <DateFormField
            form={form}
            fieldName={'dueDate'}
            label="Срок решения"
            placeholder="Контрольный срок"
            className="flex-shrink-0"
            disabled={editCase !== 'new'}
          />
        </div>
        <DirectionTypeSelector
          form={form}
          label="Направления"
          placeholder="Направления работы"
          fieldName="directions"
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
        <SelectFormField
          form={form}
          fieldName={'approver'}
          options={approvers?.operations}
          isLoading={isApproversLoading}
          label="Согласующий"
          placeholder="Выбор согласующего"
          popoverMinWidth={popoverMinWidth}
          dirtyIndicator={editCase !== 'new'}
          valueType="number"
        />
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
