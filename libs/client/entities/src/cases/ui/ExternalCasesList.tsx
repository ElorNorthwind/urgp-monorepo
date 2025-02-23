import { cn } from '@urgp/client/shared';
import { ExternalCase } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { externalSystemStyles } from '../config/caseStyles';

type ExternalCasesListProps = {
  externalCases: ExternalCase[];
  className?: string;
  compact?: boolean;
  label?: string;
  labelClassName?: string;
};

const ExternalCasesList = (
  props: ExternalCasesListProps,
): JSX.Element | null => {
  const {
    className,
    compact = false,
    externalCases,
    label,
    labelClassName,
  } = props;

  if (!externalCases || externalCases?.length === 0) return null;
  return (
    <>
      {label && (
        <div className={cn('text-xl font-semibold', labelClassName)}>
          {label}
        </div>
      )}
      <div className="overflow-hidden rounded-lg border">
        <table
          className={cn('bg-background w-full border-collapse', className)}
        >
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
                  className={cn(
                    'bg-background',
                    compact ? 'px-2' : 'px-4 py-1',
                  )}
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
    </>
  );
};

export { ExternalCasesList };
