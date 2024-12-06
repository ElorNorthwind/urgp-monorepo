import { cn } from '@urgp/client/shared';
import { CaseWithStatus } from '@urgp/shared/entities';

type CaseCardHeaderProps = {
  className?: string;
  controlCase: CaseWithStatus;
};

const CaseCardHeader = (props: CaseCardHeaderProps): JSX.Element => {
  const { className, controlCase } = props;

  return (
    <div
      className={cn(
        'bg-muted-foreground/5 flex w-full truncate p-4',
        className,
      )}
    >
      {controlCase && <h1 className="font-bold">{controlCase?.payload.fio}</h1>}
      {controlCase && (
        <p className="border-foreground/20 text-muted-foreground ml-2 w-full truncate border-l pl-2">
          {controlCase?.payload.adress}
        </p>
      )}
    </div>
  );
};

export { CaseCardHeader };
