import { cn } from '@urgp/client/shared';
import { CaseWithStatus } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { externalSystemStyles } from '../config/caseStyles';

type ExternalCasesListProps = {
  className?: string;
  compact?: boolean;
  externalCases: CaseWithStatus['payload']['externalCases'];
};

const ExternalCasesList = (props: ExternalCasesListProps): JSX.Element => {
  const { className, compact = false, externalCases } = props;

  return (
    <div
      className={cn(
        compact ? 'grid-cols-[1fr_auto]' : 'grid-cols-[auto_1fr_auto]',
        'grid w-full text-center',
        className,
      )}
    >
      {externalCases.map((c) => (
        <div
          className={cn(
            compact ? 'col-span-2' : 'col-span-3',
            'grid grid-cols-subgrid divide-x overflow-hidden border border-b-0',
            'first:rounded-t-lg last:rounded-b-lg last:border-b',
          )}
          key={c.num || '' + c.id || ''}
        >
          <div
            className={cn(
              compact && 'hidden',
              'bg-muted-foreground/5 px-4 py-1',
            )}
          >
            {externalSystemStyles[c.system].label || 'Устное поручение'}
          </div>
          <div className={cn('bg-background', compact ? 'px-2' : 'px-4 py-1')}>
            {(c.num && c.num) || '-'}
          </div>
          <div
            className={cn(
              'bg-muted-foreground/5',
              compact ? 'px-2' : 'px-4 py-1',
            )}
          >
            {(c.date && 'от ' + format(c.date, 'dd.MM.yyyy')) || '-'}
          </div>
        </div>
      ))}
    </div>
  );
};

export { ExternalCasesList };
