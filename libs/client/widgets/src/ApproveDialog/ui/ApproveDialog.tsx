import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  guestUser,
  selectApproveFormState,
  selectApproveFormValues,
  selectCurrentUser,
  setApproveFormState,
  setApproveFormValuesEmpty,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  useAuth,
  useIsMobile,
  useUserAbility,
} from '@urgp/client/shared';
import {
  GET_DEFAULT_CONTROL_DUE_DATE,
  approveControlEntityFormSchema,
  ApproveControlEntityFormDto,
} from '@urgp/shared/entities';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useApproveCase,
  useApproveOperation,
  useCaseByOperationId,
  useCurrentUserApproveTo,
} from '@urgp/client/entities';
import {
  ControlFormDisplayElement,
  DateFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { SquareX, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

type ApproveDialogProps = {
  className?: string;
  dialogWidth?: string;
};

const ApproveDialog = ({
  className,
  dialogWidth = '600px',
}: ApproveDialogProps): JSX.Element | null => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const contentStyle = {
    '--dialog-width': dialogWidth,
  } as React.CSSProperties;

  const { data: approveTo, isLoading: isApproversLoading } =
    useCurrentUserApproveTo();

  const user = useAuth();
  const formState = useSelector(selectApproveFormState);
  const isOperation = formState === 'operation';
  const values = useSelector(selectApproveFormValues);

  // Запрет на решение дел с контролем высокого уровня
  const { data: controlCase, isLoading: isStageLoading } = useCaseByOperationId(
    values?.id,
    { skip: !isOperation || !values?.id || values.id === 0 },
  );
  const i = useUserAbility();

  const form = useForm<ApproveControlEntityFormDto>({
    resolver: zodResolver(approveControlEntityFormSchema),
    values,
  });
  const watchApprover = form.watch('approveToId');

  const filteredApproveTo = approveTo?.filter((approver) => {
    if (approver.value === 0) return true;
    if (
      controlCase &&
      approver.value !== user?.id &&
      i.cannot('resolve', controlCase)
    )
      return false;
    if (values?.approveToId === approver?.value) return false;
    return true;
  });

  const approveText =
    watchApprover === 0
      ? 'Оставить в проекте'
      : watchApprover === user.id
        ? 'Одобрить'
        : 'Направить согласующему';

  const title = isOperation ? 'Согласование операции' : 'Согласование заявки';
  const subTitle = isOperation
    ? 'Решение по операции, ожидающей согласования'
    : 'Решение по заявке, ожидающей согласования';

  const [approveCase, { isLoading: isApproveCaseLoading }] = useApproveCase();
  const [approveOperation, { isLoading: isApproveOperationLoading }] =
    useApproveOperation();

  const isLoading = isApproveCaseLoading || isApproveOperationLoading;

  const closeAndReset = () => {
    dispatch(setApproveFormValuesEmpty());
    dispatch(setApproveFormState('close'));
  };
  const onOpenChange = (open: boolean) => {
    if (open === false) closeAndReset();
  };

  async function onSubmit(data: ApproveControlEntityFormDto, approve: boolean) {
    const approveEntity = isOperation ? approveOperation : approveCase;
    approveEntity({
      ...data,
      id: values?.id,
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
    closeAndReset();
  }

  useEffect(() => {
    form.reset({ ...values, approveToId: filteredApproveTo?.[0]?.value || 0 });
  }, [formState]);

  const Wrapper = isMobile ? Sheet : Dialog;
  const Content = isMobile ? SheetContent : DialogContent;
  const Footer = isMobile ? SheetFooter : DialogFooter;
  const Header = isMobile ? SheetHeader : DialogHeader;
  const Title = isMobile ? SheetTitle : DialogTitle;
  const Description = isMobile ? SheetDescription : DialogDescription;

  return (
    <Wrapper open={formState !== 'close'} onOpenChange={onOpenChange}>
      <Content
        style={contentStyle}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={cn(
          'max-h-[calc(100vh-0.5rem)]', // TODO: Отрефактори со скролл эриа как белый человек йопт
          isMobile
            ? 'w-[var(--dialog-width)] max-w-[100vw] sm:w-[var(--dialog-width)] sm:max-w-[100vw]'
            : `w-[var(--dialog-width)] max-w-[calc(100vw-3rem)]`,
        )}
      >
        <Header className="bg-muted-foreground/5 -m-6 mb-0 px-6 py-4 text-left">
          <Title>{title}</Title>
          <Description>{subTitle}</Description>
        </Header>
        <ControlFormDisplayElement
          entityType={isOperation ? 'operation' : 'case'}
          entityId={values?.id}
        />
        <Form {...form}>
          <form className={cn('relative flex flex-col gap-2', className)}>
            <TextAreaFormField
              form={form}
              fieldName={'approveNotes'}
              label="Комментарий"
              placeholder="Комментарий к заключению"
            />
            <div className="flex w-full flex-row gap-2">
              <SelectFormField
                form={form}
                fieldName={'approveToId'}
                options={filteredApproveTo}
                isLoading={isApproversLoading}
                label="Следующий согласующий"
                placeholder="Выбор следующего согласующего"
                popoverMinWidth={`calc(${dialogWidth} - 3rem)`}
                valueType="number"
                className="flex-grow"
              />
              <DateFormField
                form={form}
                fieldName={'dueDate'}
                label="Срок решения"
                placeholder="Контрольный срок"
                className={cn(
                  'flex-shrink-0',
                  (user?.id !== watchApprover || isOperation) && 'hidden',
                )}
                disabled={user?.id !== watchApprover || isOperation}
              />
            </div>
            <Footer
              className={cn(
                'bg-muted-foreground/5 -m-6 mt-4 px-6 py-4',
                isMobile && 'flex-shrink-0 gap-2',
              )}
            >
              <Button
                className="flex flex-grow flex-row gap-2"
                type="button"
                variant={'outline'}
                disabled={isLoading}
                onClick={closeAndReset}
              >
                <SquareX className="size-4 flex-shrink-0" />
                <span>Отмена</span>
              </Button>

              <Button
                type="button"
                className="flex flex-grow flex-row gap-2"
                variant="destructive"
                disabled={isLoading}
                onClick={form.handleSubmit((data) => onSubmit(data, false))}
              >
                <ThumbsDown className="size-4 flex-shrink-0" />
                <span>Отклонить</span>
              </Button>
              <Button
                type="button"
                className="flex flex-grow flex-row gap-2"
                variant="default"
                disabled={isLoading}
                onClick={form.handleSubmit((data) => onSubmit(data, true))}
              >
                <ThumbsUp className="size-4 flex-shrink-0" />
                <span>{approveText}</span>
              </Button>
            </Footer>
          </form>
        </Form>
      </Content>
    </Wrapper>
  );
};

export { ApproveDialog };
