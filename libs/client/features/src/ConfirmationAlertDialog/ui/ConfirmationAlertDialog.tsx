import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@urgp/client/shared';

type ConfirmationAlertDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
};

const ConfirmationAlertDialog = ({
  open,
  setOpen,
  onCancel,
  onConfirm,
  title = 'Подтвердите действие',
  description = 'Вы уверены, что хотите продолжить?',
  cancelText = 'Отмена',
  confirmText = 'Подтвердить',
}: ConfirmationAlertDialogProps): JSX.Element | null => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ConfirmationAlertDialog };
