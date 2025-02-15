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
  selectEscalateFormCaseId,
  selectEscalateFormState,
  setEscalateFormCaseId,
  setEscalateFormState,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  useAuth,
  useIsMobile,
} from '@urgp/client/shared';
import {
  emptyReminder,
  EscalateFormDto,
  escalateFormSchma,
  GET_DEFAULT_CONTROL_DUE_DATE,
  OperationClasses,
} from '@urgp/shared/entities';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateOperation,
  useEscalationTargets,
  useOperations,
  useUpdateOperation,
} from '@urgp/client/entities';
import {
  ControlFormDisplayElement,
  DateFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { HandHelping } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { endOfYesterday, isBefore } from 'date-fns';

type EscalateDialogProps = {
  className?: string;
  dialogWidth?: string;
};

const EscalateDialog = ({
  className,
  dialogWidth = '600px',
}: EscalateDialogProps): JSX.Element | null => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const contentStyle = {
    '--dialog-width': dialogWidth,
  } as React.CSSProperties;

  const user = useAuth();
  const formState = useSelector(selectEscalateFormState);
  const caseId = useSelector(selectEscalateFormCaseId);

  const { data: escalationTargets, isLoading: isEscalationLoading } =
    useEscalationTargets();
  const { data: reminders, isLoading: isRemindersLoading } = useOperations(
    {
      class: OperationClasses.reminder,
      case: caseId,
    },
    { skip: !caseId || caseId === 0 },
  );

  const defaultValues = useMemo(() => {
    return {
      caseId: caseId || 0,
      approveToId: user?.id,
      notes: '',
      dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
    };
  }, [caseId, user?.id]);

  const form = useForm<EscalateFormDto>({
    resolver: zodResolver(escalateFormSchma),
    defaultValues,
  });

  const title = 'Вынести на рассмотрение руководителя';
  const subTitle = 'Запросить заключение руководителя по заявке';

  const [createEscalation, { isLoading: isCreateLoading }] =
    useCreateOperation();
  const [updateEscalation, { isLoading: isUpdateLoading }] =
    useUpdateOperation();

  const isLoading = isCreateLoading || isUpdateLoading;

  const closeAndReset = () => {
    dispatch(setEscalateFormCaseId(0));
    dispatch(setEscalateFormState('close'));
  };
  const onOpenChange = (open: boolean) => {
    if (open === false) closeAndReset();
  };

  async function onSubmit(data: EscalateFormDto) {
    const existingReminder =
      reminders &&
      reminders.find((rem) => {
        return rem.controlFrom?.id === data.controlFromId;
      });

    (existingReminder
      ? updateEscalation({
          ...existingReminder,
          typeId: 12,
          notes: data.notes,
          dueDate: data.dueDate,
          controlFromId: data.controlFromId,
          controlToId: data.controlFromId,
        })
      : createEscalation({
          ...emptyReminder,
          typeId: 12,
          caseId,
          notes: data.notes,
          dueDate: data.dueDate,
          controlFromId: data.controlFromId,
          controlToId: data.controlFromId,
        })
    )
      .unwrap()
      .then(() => {
        toast.success('Направлено на рассмотрение начальника');
      })
      .catch((rejected: any) =>
        toast.error('Не удалось направить', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
    closeAndReset();
  }

  useEffect(() => {
    form.reset({
      ...defaultValues,
      controlFromId: escalationTargets?.[0]?.value || 0,
    });
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
        <ControlFormDisplayElement entityType={'case'} entityId={caseId} />
        <Form {...form}>
          <form className={cn('relative flex flex-col gap-2', className)}>
            <div className="flex w-full flex-row gap-2">
              <SelectFormField
                form={form}
                fieldName={'controlFromId'}
                options={escalationTargets}
                isLoading={isEscalationLoading}
                label="Адресат эскалации"
                placeholder="Выбор рассматривающего"
                popoverMinWidth={`calc(${dialogWidth} - 3rem)`}
                valueType="number"
                className="flex-grow"
                disabled={
                  isEscalationLoading ||
                  !escalationTargets?.length ||
                  escalationTargets.length <= 1
                }
              />
              <DateFormField
                form={form}
                fieldName={'dueDate'}
                label="Дата напоминания"
                placeholder="Напоминание"
                className={cn('flex-shrink-0')}
                disabledDays={(date) => isBefore(date, endOfYesterday())}
              />
            </div>
            <TextAreaFormField
              form={form}
              fieldName={'notes'}
              label="Комментарий"
              placeholder="Комментарий к направлению"
            />
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
                variant="default"
                disabled={isLoading || isRemindersLoading}
                onClick={form.handleSubmit((data) => onSubmit(data))}
              >
                <HandHelping className="size-5 flex-shrink-0" />
                <span>Направить</span>
              </Button>
            </Footer>
          </form>
        </Form>
      </Content>
    </Wrapper>
  );
};

export { EscalateDialog };
