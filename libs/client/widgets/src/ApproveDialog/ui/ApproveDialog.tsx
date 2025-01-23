import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useIsMobile,
} from '@urgp/client/shared';
import { Scale } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { ApproveForm } from './ApproveForm';

type ApproveDialogProps = {
  entityId: number;
  variant?: 'default' | 'mini' | 'ghost' | 'outline';
  buttonLabel?: string;
  entityType?: 'operation' | 'case';
  displayedElement?: JSX.Element | null;
  className?: string;
};

type DialogButtonProps = Pick<ApproveDialogProps, 'variant' | 'buttonLabel'> & {
  onClick: () => void;
};

const DIALOG_WIDTH = '600px';

const DialogButton = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & DialogButtonProps
>(({ variant, buttonLabel = 'Решение', className, onClick }, ref) => {
  return variant === 'mini' ? (
    <Button
      className={cn('size-6 rounded-full p-0', className)}
      variant={'ghost'}
      onClick={onClick}
    >
      <Scale className="size-4" />
    </Button>
  ) : (
    <Button
      variant={variant}
      role="button"
      className={cn('flex flex-grow flex-row gap-2', className)}
      onClick={onClick}
    >
      <Scale className="size-5 flex-shrink-0" />
      <span className="truncate">{buttonLabel}</span>
    </Button>
  );
});

const ApproveDialog = forwardRef<HTMLButtonElement, ApproveDialogProps>(
  (
    {
      entityId,
      variant = 'default',
      entityType = 'case',
      displayedElement,
      className,
      buttonLabel,
    }: ApproveDialogProps,
    ref,
  ): JSX.Element | null => {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);

    const entityTitles = {
      case: [
        'Согласование заявки',
        'Вынесение решения по заявке, ожидающей согласования',
      ],
      operation: [
        'Согласование операции',
        'Вынесение решения по операции, ожидающей согласования',
      ],
    };

    const title = entityTitles[entityType][0] || 'Согласование';
    const subTitle = entityTitles[entityType][1] || 'Вынести решение';

    const contentStyle = {
      '--dialog-width': DIALOG_WIDTH,
    } as React.CSSProperties;

    if (isMobile)
      return (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <DialogButton
              className={className}
              buttonLabel={buttonLabel}
              variant={variant}
              onClick={() => setOpen(true)}
              ref={ref}
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
            <ApproveForm
              entityId={entityId}
              entityType={entityType}
              // className={className}
              onClose={() => setOpen(false)}
              popoverMinWidth={`calc(${DIALOG_WIDTH} - 3rem)`}
            />
          </SheetContent>
        </Sheet>
      );

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DialogButton
            className={className}
            variant={variant}
            buttonLabel={buttonLabel}
            onClick={() => setOpen(true)}
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
          <ApproveForm
            entityId={entityId}
            entityType={entityType}
            onClose={() => setOpen(false)}
            popoverMinWidth={`calc(${DIALOG_WIDTH} - 3rem)`}
          />
        </DialogContent>
      </Dialog>
    );
  },
);

export { ApproveDialog };
