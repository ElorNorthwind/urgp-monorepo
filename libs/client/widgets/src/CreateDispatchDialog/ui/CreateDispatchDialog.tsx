import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  selectEditDispatch,
  setEditDispatch,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import { CalendarCog, CalendarPlus } from 'lucide-react';
import { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ControlDispatch } from '@urgp/shared/entities';
import { CreateDispatchForm } from './CreateDispatchForm';

type CreateDispatchDialogProps = {
  caseId: number;
  displayedElement?: JSX.Element | null;
  className?: string;
};

const DIALOG_WIDTH = '600px';

const NewDispatchButton = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ onClick, className }, ref) => {
  return (
    <Button
      variant="outline"
      role="button"
      className={cn('flex flex-grow flex-row gap-2', className)}
      onClick={onClick}
    >
      <CalendarPlus className="size-5" />
      <span>Новое поручение</span>
    </Button>
  );
});

type EditDispatchButtonProps = {
  editDispatch: ControlDispatch | null;
};
const EditDispatchButton = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & EditDispatchButtonProps
>(({ editDispatch, className }, ref) => {
  const dispatch = useDispatch();
  return (
    <Button
      ref={ref}
      className={cn('size-6 rounded-full p-0', className)}
      variant={'ghost'}
      onClick={() => dispatch(setEditDispatch(editDispatch))}
    >
      <CalendarCog className="size-4" />
    </Button>
  );
});

const CreateDispatchDialog = ({
  caseId,
  displayedElement,
  className,
}: CreateDispatchDialogProps): JSX.Element | null => {
  const isMobile = useIsMobile();

  const editControlDispatch = useSelector(selectEditDispatch);
  const dispatch = useDispatch();
  const isEdit = editControlDispatch && editControlDispatch !== 'new';

  const title = isEdit ? 'Изменить поручение' : 'Новое поручение';
  const subTitle = isEdit
    ? 'Внестие изменения в поручение по заявке'
    : 'Укажите параметры нового поручения по заявке';

  const contentStyle = {
    '--dialog-width': DIALOG_WIDTH,
  } as React.CSSProperties;

  if (isMobile)
    return (
      <Sheet
        open={!!editControlDispatch}
        onOpenChange={(open) =>
          open === false && dispatch(setEditDispatch(null))
        }
      >
        <SheetTrigger asChild>
          <NewDispatchButton
            onClick={() => dispatch(setEditDispatch('new'))}
            className={className}
          />
        </SheetTrigger>
        <SheetContent
          style={contentStyle}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className={cn(
            `w-[var(--dialog-width)] max-w-[100vw] sm:w-[var(--dialog-width)] sm:max-w-[100vw]`,
          )}
        >
          <SheetHeader className="mb-2 text-left">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{subTitle}</SheetDescription>
          </SheetHeader>
          {displayedElement}
          <CreateDispatchForm
            caseId={caseId}
            popoverMinWidth={`calc(${DIALOG_WIDTH} - 3rem)`}
          />
        </SheetContent>
      </Sheet>
    );

  return (
    <Dialog
      open={!!editControlDispatch}
      onOpenChange={(open) => open === false && dispatch(setEditDispatch(null))}
    >
      <DialogTrigger asChild>
        <NewDispatchButton
          onClick={() => dispatch(setEditDispatch('new'))}
          className={className}
        />
      </DialogTrigger>
      <DialogContent
        style={contentStyle}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={cn(`w-[var(--dialog-width)] max-w-[calc(100vw-3rem)]`)}
      >
        <DialogHeader className="mb-2 text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subTitle}</DialogDescription>
        </DialogHeader>
        {displayedElement}
        <CreateDispatchForm
          caseId={caseId}
          popoverMinWidth={`calc(${DIALOG_WIDTH} - 3rem)`}
        />
      </DialogContent>
    </Dialog>
  );
};

export { CreateDispatchDialog, EditDispatchButton };
