import { cn } from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import dayjs from 'dayjs';

type OldBuildingTermsChartProps = {
  terms: OldBuilding['terms'];
  className?: string;
};
const OldBuildingTermsChart = ({
  terms,
  className,
}: OldBuildingTermsChartProps): JSX.Element => {
  const minDate = terms.actual.firstResetlementStart
    ? dayjs(terms.plan.firstResetlementStart).isBefore(
        dayjs(terms.actual.firstResetlementStart),
      )
      ? dayjs(terms.plan.firstResetlementStart)
      : dayjs(terms.actual.firstResetlementStart)
    : dayjs(terms.plan.firstResetlementStart || undefined);

  const days = [
    {
      value: 'empty',
      label: '',
      plan: dayjs(terms.plan.firstResetlementStart).diff(minDate, 'days'),
      actual: dayjs(terms.actual.firstResetlementStart).diff(minDate, 'days'),
      //   plan: minDate.diff(dayjs(terms.plan.firstResetlementStart), 'days'),
      //   actual: minDate.diff(dayjs(terms.actual.firstResetlementStart), 'days'),
      actualClass: cn('bg-none'),
      isOngoing: false,
    },
    {
      value: 'firstResetlement',
      label: 'Переселение',
      plan: dayjs(terms.plan.firstResetlementEnd || undefined).diff(
        dayjs(terms.plan.firstResetlementStart || undefined),
        'days',
      ),
      actual: dayjs(terms.actual.firstResetlementEnd || undefined).diff(
        dayjs(terms.actual.firstResetlementStart || undefined),
        'days',
      ),
      actualClass: cn('bg-sky-600'),
      isOngoing:
        !terms.actual.firstResetlementEnd &&
        !terms.actual.secontResetlementEnd &&
        !terms.actual.demolitionEnd,
    },
    {
      value: 'secondResetlement',
      label: 'Отселение',
      plan: dayjs(terms.plan.secontResetlementEnd || undefined).diff(
        dayjs(terms.plan.firstResetlementEnd || undefined),
        'days',
      ),
      actual: dayjs(terms.actual.secontResetlementEnd || undefined).diff(
        dayjs(terms.actual.firstResetlementEnd || undefined),
        'days',
      ),
      actualClass: cn('bg-rose-600'),
      isOngoing:
        !terms.actual.secontResetlementEnd && !terms.actual.demolitionEnd,
    },
    {
      value: 'demolition',
      label: 'Снос',
      plan: dayjs(terms.plan.demolitionEnd || undefined).diff(
        dayjs(terms.plan.secontResetlementEnd || undefined),
        'days',
      ),
      actual: dayjs(terms.actual.demolitionEnd || undefined).diff(
        dayjs(terms.actual.secontResetlementEnd || undefined),
        'days',
      ),
      actualClass: cn('bg-emerald-600'),
      isOngoing: !terms.actual.demolitionEnd,
    },
  ];
  const maxValue = Math.max(
    days.reduce((acc, day) => acc + day.plan, 0) || 0,
    days.reduce((acc, day) => acc + day.actual, 0) || 0,
  );

  if (maxValue === 0)
    return (
      <div className={cn('flex w-full place-items-center', className)}>
        Нет данных
      </div>
    );

  return (
    <div className={cn('flex w-full flex-col gap-1 p-2', className)}>
      <div className="flex w-full flex-row justify-start gap-0 align-middle">
        {days
          .filter((day) => day.plan > 0 || day.value === 'empty')
          .map((day) => (
            <div
              key={day.value}
              className={cn(
                day.actualClass,
                'opacity-50',
                'flex h-[1.25rem] items-center justify-center text-xs text-white',
                'last:rounded-r [&:nth-child(2)]:rounded-l',
              )}
              style={{ width: Math.round((day.plan / maxValue) * 100) + '%' }}
            >
              {day.value === 'empty' || day.plan / maxValue < 0.07
                ? ''
                : day.plan}
            </div>
          ))}
      </div>
      <div className="flex w-full flex-row items-center justify-start gap-0 align-middle">
        {days
          .filter((day) => day.actual > 0 || day.value === 'empty')
          .map((day) => (
            <div
              key={day.value}
              className={cn(
                day.actualClass,
                'relative flex h-[1.25rem] items-center justify-center text-xs text-white',
                day.isOngoing &&
                  "after:bg-striped overflow-hidden after:absolute after:inset-0 after:opacity-20 after:content-['']",
                'last:rounded-r [&:nth-child(2)]:rounded-l',
              )}
              style={{ width: Math.round((day.actual / maxValue) * 100) + '%' }}
            >
              {day.value === 'empty' || day.actual / maxValue < 0.07
                ? ''
                : day.isOngoing
                  ? ''
                  : day.actual}
            </div>
          ))}
      </div>
    </div>
  );
};

export { OldBuildingTermsChart };
