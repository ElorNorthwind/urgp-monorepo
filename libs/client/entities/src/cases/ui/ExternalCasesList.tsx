import { cn } from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { externalSystemStyles } from '../config/caseStyles';

type ExternalCasesListProps = {
  className?: string;
  compact?: boolean;
  externalCases: Case['payload']['externalCases'];
};

const ExternalCasesList = (props: ExternalCasesListProps): JSX.Element => {
  const { className, compact = false, externalCases } = props;

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className={cn('w-full border-collapse', className)}>
        <tbody>
          {externalCases.map((c) => (
            <tr
              key={c.num || '' + c.id || ''}
              className="divide-x border-b last:border-b-0"
            >
              {!compact && (
                <td className={cn('bg-muted-foreground/5 px-4 py-1')}>
                  {externalSystemStyles[c.system].label || 'Устное поручение'}
                </td>
              )}
              <td
                className={cn('bg-background', compact ? 'px-2' : 'px-4 py-1')}
              >
                {(c.num && c.num) || '-'}
              </td>
              <td
                className={cn(
                  'bg-muted-foreground/5',
                  compact ? 'px-2' : 'px-4 py-1',
                )}
              >
                {c.date ? 'от ' + format(c.date, 'dd.MM.yyyy') : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ExternalCasesList };
