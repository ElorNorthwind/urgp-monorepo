import { Separator } from '@radix-ui/react-separator';
import { useLocation, useMatch, useNavigate } from '@tanstack/react-router';
import { Button, cn } from '@urgp/client/shared';
import { CaseClasses, CaseFull } from '@urgp/shared/entities';
import { ChevronDown, X } from 'lucide-react';
import { from } from 'rxjs';

type CaseCardHeaderProps = {
  className?: string;
  controlCase: CaseFull;
  onClose?: () => void;
  total?: number;
  filtered?: number;
  onPrevCase?: () => void;
  onNextCase?: () => void;
};

const CaseCardHeader = (props: CaseCardHeaderProps): JSX.Element => {
  const { className, controlCase, onClose, onNextCase, onPrevCase } = props;
  const pathname = useLocation().pathname;
  const navigate = useNavigate({ from: pathname });
  // const match = useMatch({ from: '/control/case/$caseId' });

  return (
    <div
      className={cn(
        'bg-muted-foreground/5 flex w-full flex-shrink-0 justify-center gap-2 truncate p-4',
        className,
      )}
    >
      {controlCase && (
        <h1
          className="cursor-pointer font-bold"
          onClick={() =>
            navigate({
              to: `/control/case/$caseId`,
              params: { caseId: controlCase?.id },
            })
          }
        >
          {controlCase?.title}
        </h1>
      )}
      {controlCase && controlCase.class !== CaseClasses.problem && (
        <p className="border-foreground/20 text-muted-foreground h-full flex-shrink truncate border-l pl-2">
          {controlCase?.extra}
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
