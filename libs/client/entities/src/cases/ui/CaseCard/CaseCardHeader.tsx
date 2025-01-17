import { Separator } from '@radix-ui/react-separator';
import { useNavigate } from '@tanstack/react-router';
import { Button, cn } from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { ChevronDown, X } from 'lucide-react';

type CaseCardHeaderProps = {
  className?: string;
  controlCase: Case;
  onClose?: () => void;
  total?: number;
  filtered?: number;
  onPrevCase?: () => void;
  onNextCase?: () => void;
};

const CaseCardHeader = (props: CaseCardHeaderProps): JSX.Element => {
  const { className, controlCase, onClose, onNextCase, onPrevCase } = props;
  const navigate = useNavigate({ from: '/control' });

  return (
    <div
      className={cn(
        'bg-muted-foreground/5 flex w-full flex-shrink-0 justify-center gap-2 truncate p-4',
        className,
      )}
    >
      {controlCase && (
        <h1 className="font-bold">{controlCase?.payload?.fio}</h1>
      )}
      {controlCase && (
        <p className="border-foreground/20 text-muted-foreground h-full truncate border-l pl-2">
          {controlCase?.payload?.adress}
        </p>
      )}
      {onClose && (
        <>
          <Button
            role="button"
            variant="ghost"
            className="ml-auto size-6 p-0"
            onClick={() => onPrevCase && onPrevCase()}
            disabled={!onPrevCase}
          >
            <ChevronDown className="size-5 rotate-180" />
          </Button>
          <Button
            role="button"
            variant="ghost"
            className="size-6 p-0"
            onClick={() => onNextCase && onNextCase()}
            disabled={!onNextCase}
          >
            <ChevronDown className="size-5" />
          </Button>
          <Separator className="border-foreground/20 border-l" />
          <Button
            role="button"
            variant="ghost"
            className="size-6 p-0"
            onClick={() => onClose && onClose()}
            disabled={!onClose}
          >
            <X className="size-5" />
          </Button>
        </>
      )}
    </div>
  );
};

export { CaseCardHeader };
