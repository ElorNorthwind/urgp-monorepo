import { useLazySessionResults } from '@urgp/client/entities';
import { Button, buttonVariants, cn, exportToExcel } from '@urgp/client/shared';
import { clearMunicipalAddressPart } from '@urgp/shared/entities';
import { VariantProps } from 'class-variance-authority';
import { FileSpreadsheet } from 'lucide-react';
import React, { forwardRef } from 'react';
import { toast } from 'sonner';

type ExportAddressResultButtonProps = {
  sessionId: number;
  className?: string;
} & VariantProps<typeof buttonVariants>;

const ExportAddressResultButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLInputElement> & ExportAddressResultButtonProps
>((props: ExportAddressResultButtonProps, ref): JSX.Element => {
  const { sessionId, className, size, variant = 'outline' } = props;

  const [triggerFetch, { isLoading, isFetching }] = useLazySessionResults();

  const onClick = () => {
    if (!sessionId || sessionId === 0) {
      toast.error('Не удалось загрузить данные', {
        description: 'Не указан ID сессии',
      });
      return;
    }
    triggerFetch(sessionId)
      .unwrap()
      .then((data) => {
        const formatedData = data.map((address) => ({
          ...address,
          'Полный адрес': clearMunicipalAddressPart(address['Полный адрес']),
        }));
        exportToExcel(formatedData);
      })
      .catch((rejected: any) =>
        toast.error('Не удалось загрузить данные', {
          description: rejected.data?.message || 'Неизвестная ошибка',
        }),
      );
  };

  return (
    <Button
      role="button"
      size={size}
      variant={variant}
      disabled={isLoading || isFetching}
      onClick={onClick}
      className={cn('ml-auto flex flex-row gap-1', className)}
    >
      <FileSpreadsheet className="size-5 flex-shrink-0" />
      <span>Скачать результат</span>
    </Button>
  );
});

export { ExportAddressResultButton };
