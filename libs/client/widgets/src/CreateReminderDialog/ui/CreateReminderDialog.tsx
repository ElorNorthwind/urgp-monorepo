import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  guestUser,
  selectCurrentUser,
  selectEditReminder,
  setEditReminder,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import { Eye, ScanEye } from 'lucide-react';
import { forwardRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ControlReminder } from '@urgp/shared/entities';
import { CreateReminderForm } from './CreateReminderForm';
import { RemindersList, useReminders } from '@urgp/client/entities';

type CreateReminderDialogProps = {
  caseId: number;
  displayedElement?: JSX.Element | null;
  className?: string;
  expectedDueDate?: Date;
  // clickedReminder: 'new' | ControlReminder;
};

const DIALOG_WIDTH = '600px';

type ReminderButtonProps = {
  editReminder: 'new' | ControlReminder;
  disabled?: boolean;
  reminders?: ControlReminder[];
};

const ReminderButton = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & ReminderButtonProps
>(({ editReminder, className, reminders, disabled = false }, ref) => {
  const dispatch = useDispatch();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="button"
          disabled={disabled}
          className={cn('flex flex-grow flex-row gap-2', className)}
          onClick={() => dispatch(setEditReminder(editReminder))}
        >
          {editReminder === 'new' || editReminder?.payload?.doneDate ? (
            <>
              <Eye className="mr-1 size-4 flex-shrink-0 opacity-50" />
              <span>Отслеживать</span>
            </>
          ) : (
            <>
              <ScanEye className="mr-1 size-4 flex-shrink-0" />
              <span>Отслеживание</span>
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <RemindersList reminders={reminders} label="Кто подписан на заявку?" />
      </TooltipContent>
    </Tooltip>
  );
});

const CreateReminderDialog = ({
  caseId,
  displayedElement,
  expectedDueDate,
  // clickedReminder,
  className,
}: CreateReminderDialogProps): JSX.Element | null => {
  const isMobile = useIsMobile();

  const dispatch = useDispatch();
  const editReminder = useSelector(selectEditReminder);

  const {
    data: reminders,
    isLoading,
    isFetching,
  } = useReminders(caseId, { skip: !caseId });
  const user = useSelector(selectCurrentUser) || guestUser;

  const userReminder =
    reminders?.find((rem) => {
      return rem?.payload?.observer?.id === user?.id;
    }) || 'new';

  // useEffect(() => {
  //   dispatch(setEditReminder(userReminder));
  // }, [userReminder]);

  const isEdit = editReminder && editReminder !== 'new';

  const title = isEdit ? 'Изменить напоминание' : 'Поставить напоминание';
  const subTitle = isEdit
    ? 'Внестие изменения в напоминание по заявке'
    : 'Отслеживать заявку';

  const contentStyle = {
    '--dialog-width': DIALOG_WIDTH,
  } as React.CSSProperties;

  const onOpenChange = (open: boolean) => {
    open === false && dispatch(setEditReminder(null));
  };

  const Wrapper = isMobile ? Sheet : Dialog;
  const Trigger = isMobile ? SheetTrigger : DialogTrigger;
  const Content = isMobile ? SheetContent : DialogContent;
  const Header = isMobile ? SheetHeader : DialogHeader;
  const Title = isMobile ? SheetTitle : DialogTitle;
  const Description = isMobile ? SheetDescription : DialogDescription;

  return (
    <Wrapper open={!!editReminder} onOpenChange={onOpenChange}>
      <Trigger asChild>
        <ReminderButton
          reminders={reminders}
          editReminder={userReminder}
          className={className}
          disabled={isLoading || isFetching}
        />
      </Trigger>
      <Content
        style={contentStyle}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={cn(
          isMobile
            ? 'w-[var(--dialog-width)] max-w-[100vw] sm:w-[var(--dialog-width)] sm:max-w-[100vw]'
            : `w-[var(--dialog-width)] max-w-[calc(100vw-3rem)]`,
        )}
      >
        <Header className="mb-2 text-left">
          <Title>{title}</Title>
          <Description>{subTitle}</Description>
        </Header>
        {displayedElement}
        <CreateReminderForm caseId={caseId} expectedDueDate={expectedDueDate} />
      </Content>
    </Wrapper>
  );
};

export { CreateReminderDialog };
