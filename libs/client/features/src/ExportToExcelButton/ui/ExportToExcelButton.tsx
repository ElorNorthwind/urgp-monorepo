import {
  Button,
  buttonVariants,
  cn,
  exportToExcel,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { VariantProps } from 'class-variance-authority';
import { FileSpreadsheet } from 'lucide-react';
import React, { forwardRef } from 'react';

type ExportToExcelButtonProps = {
  data: Record<string, any>;
  className?: string;
  fileName?: string;
  disabled?: boolean;
  label?: string;
} & VariantProps<typeof buttonVariants>;

const ExportToExcelButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLInputElement> & ExportToExcelButtonProps
>((props: ExportToExcelButtonProps, ref): JSX.Element | null => {
  const {
    data,
    className,
    size,
    variant = 'outline',
    disabled,
    fileName = 'Выгрузка',
    label,
  } = props;

  const onClick = () => {
    exportToExcel(data, fileName);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          role="button"
          size={size}
          variant={variant}
          disabled={disabled}
          onClick={onClick}
          className={cn('flex flex-shrink-0 flex-row gap-1', className)}
        >
          <FileSpreadsheet className="size-5 flex-shrink-0" />
          {label && <span>{label}</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Экспортировать в Excel</TooltipContent>
    </Tooltip>
  );
});

export default ExportToExcelButton;
