import { useResetSessionErrors } from '@urgp/client/entities';
import {
  Button,
  buttonVariants,
  cn,
  useUserAbility,
} from '@urgp/client/shared';
import { AddressSessionFull } from '@urgp/shared/entities';
import { VariantProps } from 'class-variance-authority';
import { FolderSync } from 'lucide-react';
import React, { forwardRef } from 'react';
import { toast } from 'sonner';

type ResetAddressErrorsButtonProps = {
  session?: AddressSessionFull;
  className?: string;
} & VariantProps<typeof buttonVariants>;

const ResetAddressErrorsButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLInputElement> & ResetAddressErrorsButtonProps
>((props: ResetAddressErrorsButtonProps, ref): JSX.Element | null => {
  const { session, className, size, variant = 'outline' } = props;
  const i = useUserAbility();
  if (!session || i.cannot('update', session)) return null;
  const [resetErrors, { isLoading }] = useResetSessionErrors();

  const onClick = () => {
    resetErrors(session.id)
      .unwrap()
      .then((data) => {
        toast.success('Проблемные адреса перезапрошены');
      })
      .catch((rejected: any) =>
        toast.error('Не удалось перезапросить проблемные адреса', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  };

  return (
    <Button
      role="button"
      size={size}
      variant={variant}
      disabled={isLoading}
      onClick={onClick}
      className={cn('flex flex-row gap-1', className)}
    >
      <FolderSync className="size-5 flex-shrink-0" />
      <span>Перезапросить проблемные</span>
    </Button>
  );
});

export { ResetAddressErrorsButton };
