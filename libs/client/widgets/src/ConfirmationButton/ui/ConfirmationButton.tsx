import {
  Button,
  cn,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@urgp/client/shared';
import { Trash, X, Check, LucideProps } from 'lucide-react';
import { useState } from 'react';

type ConfirmationButtonProps = {
  onAccept: () => void;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  disabled?: boolean;
  className?: string;
  label?: string;
};
const ConfirmationButton = ({
  onAccept,
  disabled = false,
  className,
  Icon,
  label,
}: ConfirmationButtonProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
      {!isOpen && (
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn('size-6 rounded-full p-1', className)}
            disabled={disabled}
          >
            {Icon ? <Icon className="size-4" /> : <Trash className="size-4" />}
          </Button>
        </CollapsibleTrigger>
      )}

      <CollapsibleContent className="flex flex-row items-center space-x-1">
        <Button
          variant="ghost"
          className={cn('size-6 rounded-full p-1', className)}
          disabled={disabled}
          onClick={() => {
            setIsOpen(false);
            onAccept && onAccept();
          }}
        >
          <Check className={cn('size-6 text-rose-500 transition')} />
        </Button>
        {label && <span className="text-md font-normal">{label}</span>}
        <Button
          variant="ghost"
          className={cn('size-6 rounded-full p-1', className)}
          disabled={disabled}
          onClick={() => setIsOpen(false)}
        >
          <X className="size-4" />
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export { ConfirmationButton };
