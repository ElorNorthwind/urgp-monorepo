import { Separator } from '@radix-ui/react-separator';
import { Button, cn } from '@urgp/client/shared';
import { CaseWithStatus } from '@urgp/shared/entities';
import { ChevronDown, X } from 'lucide-react';

type CaseCardHeaderProps = {
  className?: string;
  controlCase: CaseWithStatus;
  onClose?: () => void;
  total?: number;
  filtered?: number;
};

const CaseCardHeader = (props: CaseCardHeaderProps): JSX.Element => {
  const { className, controlCase, onClose } = props;

  return (
    <div
      className={cn(
        'bg-muted-foreground/5 flex w-full justify-center gap-2 truncate p-4',
        className,
      )}
    >
      {controlCase && <h1 className="font-bold">{controlCase?.payload.fio}</h1>}
      {controlCase && (
        <p className="border-foreground/20 text-muted-foreground w-full truncate border-l pl-2">
          {controlCase?.payload.adress}
        </p>
      )}
      <Button variant="ghost" className="size-6 p-0">
        <ChevronDown className="size-5 rotate-180" />
      </Button>
      <Button variant="ghost" className="size-6 p-0">
        <ChevronDown className="size-5" />
      </Button>
      <Separator className="border-foreground/20 ml-auto border-l" />
      {onClose && (
        <Button variant="ghost" className="size-6 p-0" onClick={onClose}>
          <X className="size-5" />
        </Button>
      )}
    </div>
  );
};

export { CaseCardHeader };
