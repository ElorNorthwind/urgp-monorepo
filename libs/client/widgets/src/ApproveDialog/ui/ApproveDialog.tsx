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
  selectApproveFormEntityId,
  selectApproveFormState,
  selectCurrentUser,
  setApproveFormEntityId,
  setApproveFormState,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  useIsMobile,
  useUserAbility,
} from '@urgp/client/shared';
import {
  GET_DEFAULT_CONTROL_DUE_DATE,
  userInputApproveFormValues,
  UserInputApproveFormValuesDto,
} from '@urgp/shared/entities';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useApproveCase,
  useApproveOperation,
  useCaseByOperationId,
  useCurrentUserApprovers,
} from '@urgp/client/entities';
import {
  ControlFormDisplayElement,
  DateFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
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

  const { data: approvers, isLoading: isApproversLoading } =
    useCurrentUserApprovers();

  const user = useSelector(selectCurrentUser) || guestUser;
  const formState = useSelector(selectApproveFormState);
  const isOperation = formState === 'operation';
  const entityId = useSelector(selectApproveFormEntityId);

  // Запрет на решение дел с контролем высокого уровня
  const { data: controlCase, isLoading: isStageLoading } = useCaseByOperationId(
    entityId,
    { skip: !isOperation || !entityId || entityId === 0 },
  );
  const i = useUserAbility();
  const filteredOperationApprovers = controlCase
    ? approvers?.operations.filter((approver) => {
        return approver.value !== user.id || i.can('resolve', controlCase);
      })
    : approvers?.operations;

  const defaultValues = useMemo(() => {
    return {
      nextApproverId:
        // TODO: Refactor approvers!
        approvers?.cases?.[0].value || null,
      approveNotes: '',
      dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
    };
  }, [approvers]);

  const form = useForm<UserInputApproveFormValuesDto>({
    resolver: zodResolver(userInputApproveFormValues),
    defaultValues,
  });
  const watchApprover = form.watch('nextApproverId');

  const title = isOperation ? 'Согласование операции' : 'Согласование заявки';
  const subTitle = isOperation
    ? 'Решение по операции, ожидающей согласования'
    : 'Решение по заявке, ожидающей согласования';

  const [approveCase, { isLoading: isApproveCaseLoading }] = useApproveCase();
  const [approveOperation, { isLoading: isApproveOperationLoading }] =
    useApproveOperation();

  const isLoading = isApproveCaseLoading || isApproveOperationLoading;

  const closeAndReset = () => {
    dispatch(setApproveFormEntityId(0));
    dispatch(setApproveFormState('close'));
  };
  const onOpenChange = (open: boolean) => {
    if (open === false) closeAndReset();
  };

  async function onSubmit(
    data: UserInputApproveFormValuesDto,
    approve: boolean,
  ) {
    const approveEntity = isOperation ? approveOperation : approveCase;
    approveEntity({
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
    closeAndReset();
  }

  useEffect(() => {
    form.reset(defaultValues);
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
          entityId={entityId}
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
                fieldName={'nextApproverId'}
                options={
                  isOperation ? filteredOperationApprovers : approvers?.cases
                }
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
                Отмена
              </Button>

              <Button
                type="button"
                className="flex flex-grow flex-row gap-2"
                variant="destructive"
                disabled={isLoading}
                onClick={form.handleSubmit((data) => onSubmit(data, false))}
              >
                <ThumbsDown className="size-5 flex-shrink-0" />
                <span>Отклонить</span>
              </Button>
              <Button
                type="button"
                className="flex flex-grow flex-row gap-2"
                variant="default"
                disabled={isLoading}
                onClick={form.handleSubmit((data) => onSubmit(data, true))}
              >
                <ThumbsUp className="size-5 flex-shrink-0" />
                <span>Одобрить</span>
              </Button>
            </Footer>
          </form>
        </Form>
      </Content>
    </Wrapper>
  );
};

export { ApproveDialog };
