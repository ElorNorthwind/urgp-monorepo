import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
} from '@urgp/client/shared';

import { cloneElement, ReactNode } from 'react';

type CardTabProps = {
  label?: string | null;
  button?: JSX.Element;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};
const CardTab = (props: CardTabProps): JSX.Element | null => {
  const {
    label,
    button,
    children,
    className,
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

  const styledButton =
    button &&
    cloneElement(button, {
      variant: 'link',
      className: cn(
        'h-8 flex-grow-0 px-2',
        accordionItemName && 'absolute right-6 top-3',
      ),
    });

  if (accordionItemName)
    return (
      <AccordionItem
        value={accordionItemName}
        className={cn('relative', className)}
      >
        <AccordionTrigger
          className={cn(
            'relative flex flex-row items-center justify-between',
            titleClassName,
          )}
        >
          {label}
        </AccordionTrigger>
        <AccordionContent
          className={cn(
            'bg-background overflow-hidden rounded-t-lg border border-b-0 p-2',
            contentClassName,
          )}
        >
          {children}
        </AccordionContent>
        {styledButton && styledButton}
      </AccordionItem>
    );

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        className={cn(
          'flex flex-row items-center justify-between',
          titleClassName,
        )}
      >
        <div className="text-lg font-semibold">{label}</div>
        {styledButton && styledButton}
      </div>
      <div
        className={cn(
          'bg-background overflow-hidden rounded-lg border p-2',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export { CardTab };
