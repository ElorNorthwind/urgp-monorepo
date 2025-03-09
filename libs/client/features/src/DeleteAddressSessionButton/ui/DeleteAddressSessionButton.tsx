import {
  useDeleteSession,
  useLazySessionResults,
  useResetSessionErrors,
} from '@urgp/client/entities';
import {
  Button,
  buttonVariants,
  cn,
  exportToExcel,
  useUserAbility,
} from '@urgp/client/shared';
import {
  AddressSessionFull,
  clearMunicipalAddressPart,
} from '@urgp/shared/entities';
import { VariantProps } from 'class-variance-authority';
import { FileSpreadsheet, FolderSync, Trash2 } from 'lucide-react';
import React, { forwardRef, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmationAlertDialog } from '../../ConfirmationAlertDialog';
import { set } from 'date-fns';
import { useLocation, useNavigate } from '@tanstack/react-router';

type DeleteAddressSessionButtonProps = {
  session: AddressSessionFull;
  className?: string;
} & VariantProps<typeof buttonVariants>;

const DeleteAddressSessionButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLInputElement> & DeleteAddressSessionButtonProps
>((props: DeleteAddressSessionButtonProps, ref): JSX.Element | null => {
  const { session, className, size, variant = 'outline' } = props;
  const i = useUserAbility();
  const pathname = useLocation().pathname;
  const navigate = useNavigate({ from: pathname });

  if (!session || i.cannot('delete', session)) return null;
  const [resetErrors, { isLoading }] = useDeleteSession();

  const [open, setOpen] = useState(false);

  const onConfirm = () => {
    resetErrors(session?.id)
      .unwrap()
      .then(() => {
        navigate({ search: { sessionId: undefined } } as any);
        toast.success('Запрос удален');
      })
      .catch((rejected: any) =>
        toast.error('Не удалось удалить запрос', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  };

  return (
    <>
      <Button
        role="button"
        size={size}
        variant={variant}
        disabled={isLoading}
        onClick={() => setOpen(true)}
        className={cn('flex flex-row gap-1', className)}
      >
        <Trash2 className="size-5 flex-shrink-0" />
        <span>Удалить запрос</span>
      </Button>
      <ConfirmationAlertDialog
        title={'Удалить запрос?'}
        description={'Это действие необратимо'}
        confirmText={'Удалить'}
        cancelText={'Отмена'}
        open={open}
        setOpen={setOpen}
        // onCancel={closeAndReset}
        // onConfirm={() => form.handleSubmit(onEdit as any)()}
        onConfirm={onConfirm}
      />
    </>
  );
});

export { DeleteAddressSessionButton };
