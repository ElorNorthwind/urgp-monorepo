import {
  Button,
  cn,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@urgp/client/shared';
import { Trash, X, Check } from 'lucide-react';
import { useState } from 'react';

type DeleteMessageButtonProps = {
  onAccept: () => void;
  disabled?: boolean;
  className?: string;
};
const DeleteMessageButton = ({
  onAccept,
  disabled = false,
  className,
}: DeleteMessageButtonProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
      {!isOpen && (
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn('h-6 w-6 rounded-full p-1', className)}
            disabled={disabled}
            // onClick={onAccept}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      )}

      <CollapsibleContent className="flex flex-row items-center space-x-1">
        <Button
          variant="ghost"
          className={cn('h-6 w-6 rounded-full p-1', className)}
          disabled={disabled}
          onClick={onAccept}
        >
          <Check className={cn('h-4 w-4 text-rose-500 transition')} />
        </Button>
        {/* <div>точно?</div> */}
        <Button
          variant="ghost"
          className={cn('h-6 w-6 rounded-full p-1', className)}
          disabled={disabled}
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export { DeleteMessageButton };
