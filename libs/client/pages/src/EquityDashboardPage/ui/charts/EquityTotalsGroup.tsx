import { useNavigate } from '@tanstack/react-router';
import { cn } from '@urgp/client/shared';
import { EquityTotals } from '@urgp/shared/entities';
import { EquityTotalsBar } from './EquityTotalsBar';

type EquityTotalsGroupProps = {
  data?: EquityTotals[];
  isLoading?: boolean;
  className?: string;
  customMax?: number;
  thrashold?: number;
  scope?: 'complex' | 'building' | 'developer';
  target?: number | string;
  title?: string;
  subtitle?: string;
  buildingList?: number[];
};

const EquityTotalsGroup = ({
  data,
  isLoading,
  className,
  scope = 'complex',
  customMax,
  thrashold = 0.2,
  target,
  title = 'Заголовок',
  subtitle = 'Подзаголовок',
  buildingList,
}: EquityTotalsGroupProps): JSX.Element => {
  const navigate = useNavigate({ from: '/equity' });

  const groupData = !data
    ? []
    : scope === 'complex'
      ? data.filter((item) => item?.building?.complexId === target)
      : scope === 'building'
        ? data.filter((item) => item?.building?.id === target)
        : data.filter((item) => item?.building?.developerShort === target);

  return (
    <div className={cn('grid grid-cols-[1fr_1fr_1fr] gap-2', className)}>
      <div className="flex w-full flex-col gap-0">
        <EquityTotalsBar
          data={groupData}
          action="give"
          objectType={1}
          className="w-full"
          direction="left"
          customMax={customMax}
          thrashold={thrashold}
          isLoading={isLoading}
        />
        <EquityTotalsBar
          data={groupData}
          action="give"
          objectType={2}
          className="w-full"
          direction="left"
          customMax={customMax}
          thrashold={thrashold}
          isLoading={isLoading}
        />
      </div>
      <div
        className={cn(
          'bg-muted-foreground/5 flex flex-col items-center justify-center gap-2 overflow-hidden rounded border shadow-sm',
          buildingList &&
            'hover:from-muted-foreground/10 hover:via-muted-foreground/5 hover:bg-muted-foreground/5 cursor-pointer hover:bg-gradient-to-br',
        )}
        onClick={() => {
          buildingList &&
            navigate({
              to: './objects',
              search: {
                building: buildingList,
              },
            });
        }}
      >
        <span className="text-2xl font-bold leading-snug">{title}</span>
        <span className="text-muted-foreground -mt-1.5 leading-none">
          {subtitle}
        </span>
      </div>
      <div className="flex w-full flex-col gap-0">
        <EquityTotalsBar
          data={groupData}
          action="take"
          objectType={1}
          className="w-full"
          direction="right"
          customMax={customMax}
          thrashold={thrashold}
          isLoading={isLoading}
        />
        <EquityTotalsBar
          data={groupData}
          action="take"
          objectType={2}
          className="w-full"
          direction="right"
          customMax={customMax}
          thrashold={thrashold}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export { EquityTotalsGroup };
