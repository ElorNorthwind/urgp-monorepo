import { Button, cn, Form, Skeleton } from '@urgp/client/shared';
import {
  userInputApproveFormValues,
  UserInputApproveFormValuesDto,
} from '@urgp/shared/entities';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { SelectFormField, TextAreaFormField } from '@urgp/client/widgets';
import { useEffect, useMemo } from 'react';
import {
  useApproveCase,
  useApproveOperation,
  useCurrentUserApprovers,
} from '@urgp/client/entities';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

type ApproveFormProps = {
  entityId: number;
  entityType?: 'operation' | 'case';
  onClose?: () => void;
  className?: string;
  popoverMinWidth?: string;
};

const ApproveForm = ({
  entityId,
  entityType = 'case',
  className,
  onClose,
  popoverMinWidth,
}: ApproveFormProps): JSX.Element | null => {
  const { data: approvers, isLoading: isApproversLoading } =
    useCurrentUserApprovers();

  const emptyApproveData = useMemo(() => {
    return {
      nextApproverId: approvers?.operations?.[0].value || null,
      approveNotes: '',
    };
  }, [approvers]);

  const form = useForm<UserInputApproveFormValuesDto>({
    resolver: zodResolver(userInputApproveFormValues),
    defaultValues: emptyApproveData,
  });

  const [approveCase, { isLoading: isApproveCaseLoading }] = useApproveCase();
  const [approveOperation, { isLoading: isApproveOperationLoading }] =
    useApproveOperation();

  const apiCalls = {
    case: approveCase,
    operation: approveOperation,
  };
  const isLoading = isApproveCaseLoading || isApproveOperationLoading;

  async function onSubmit(
    data: UserInputApproveFormValuesDto,
    approve: boolean,
  ) {
    const apiCall = apiCalls[entityType];
    apiCall &&
      apiCall({
        ...data,
        id: entityId,
        approveStatus: approve ? 'approved' : 'rejected',
      })
        .unwrap()
        .then(() => {
          toast.success('Одобрено');
        })
        .catch((rejected: any) =>
          toast.error('Не удалось одобрить', {
            description: rejected.data?.message || 'Неизвестная ошибка',
          }),
        );
  }

  useEffect(() => {
    form.reset(emptyApproveData);
  }, [approvers, isApproversLoading]);

  if (isApproversLoading) {
    return <Skeleton className={cn('h-[550px] w-full', className)} />;
  }

  return (
    <Form {...form}>
      <form className={cn('flex flex-col gap-4', className)}>
        <TextAreaFormField
          form={form}
          fieldName={'approveNotes'}
          label="Комментарий"
          placeholder="Комментарий к заключению"
        />
        <SelectFormField
          form={form}
          fieldName={'nextApproverId'}
          options={approvers?.operations}
          isLoading={isApproversLoading}
          label="Следующий согласующий"
          placeholder="Выбор следующего согласующего"
          popoverMinWidth={popoverMinWidth}
          valueType="number"
        />
        <div className="flex w-full items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-grow"
            disabled={isLoading}
            onClick={() => {
              form.reset(emptyApproveData);
              onClose && onClose();
            }}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex flex-grow flex-row gap-2"
            disabled={isLoading}
            onClick={() => {
              form.reset(emptyApproveData);
              onSubmit(form.getValues(), false);
              onClose && onClose();
            }}
          >
            <ThumbsDown className="size-5" />
            <span>Отклонить</span>
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            className="flex flex-grow flex-row gap-2"
            onClick={() => {
              form.reset(emptyApproveData);
              onSubmit(form.getValues(), true);
              onClose && onClose();
            }}
          >
            <ThumbsUp className="size-5" />
            <span>Одобрить</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { ApproveForm };
