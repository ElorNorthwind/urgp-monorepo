import { cn, useUserAbility } from '@urgp/client/shared';
import { CaseFull } from '@urgp/shared/entities';

import { externalSystemStyles } from '@urgp/client/entities';
import { CardTab } from '@urgp/client/features';
import { format } from 'date-fns';

type ExternalCasesTabProps = {
  controlCase?: CaseFull;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const ExternalCasesTab = (props: ExternalCasesTabProps): JSX.Element | null => {
  const {
    controlCase,
    className,
    label = 'Связанные номера',
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

  if (
    !controlCase ||
    !controlCase?.externalCases ||
    controlCase?.externalCases?.length === 0
  )
    return null;

  return (
    <CardTab
      label={label}
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn('p-0', contentClassName)}
      accordionItemName={accordionItemName}
    >
      <table className={cn('bg-background w-full border-collapse', className)}>
        <tbody>
          {controlCase?.externalCases.map((c) => (
            <tr
              key={c.num || '' + c.id || ''}
              className="divide-x border-b last:border-b-0"
            >
              <td className={cn('bg-muted-foreground/5 px-4 py-1')}>
                {externalSystemStyles[c.system].label || 'Устное поручение'}
              </td>
              <td className={cn('bg-background', 'px-4 py-1')}>
                {(c.num && c.num) || '-'}
              </td>
              <td className={cn('bg-muted-foreground/5', 'px-4 py-1')}>
                {c.date ? 'от ' + format(c.date, 'dd.MM.yyyy') : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardTab>
  );
};

export { ExternalCasesTab };
