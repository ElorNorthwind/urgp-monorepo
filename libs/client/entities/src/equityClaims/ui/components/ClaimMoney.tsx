import { cn } from '@urgp/client/shared';
import { EquityClaim } from '@urgp/shared/entities';
import { TicketCheck, TicketX } from 'lucide-react';

type ClaimMoneyProps = {
  claim?: EquityClaim;
  className?: string;
};

const ClaimMoney = (props: ClaimMoneyProps): JSX.Element | null => {
  const { claim, className } = props;

  return (
    <div
      className={cn(
        'flex w-full flex-row flex-nowrap justify-start gap-2 overflow-hidden truncate',
        '[&>*]:truncate [&>*]:border-l [&>*]:pl-2',
        'first:[&>*]:border-l-0 first:[&>*]:pl-0',
        className,
      )}
    >
      {claim?.sumPaid && claim?.sumPaid > 0 && (
        <div className="flex flex-row items-center gap-1 ">
          <TicketCheck className="size-4 flex-shrink-0 text-sky-500" />
          <span className="text-sky-500">{'внесено:'}</span>
          <span className="font-thin">
            {new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
            }).format(claim?.sumPaid)}
          </span>
        </div>
      )}
      {claim?.sumUnpaid && claim?.sumUnpaid > 0 && (
        <div className="flex flex-row items-center gap-1 ">
          <TicketX className="size-4 flex-shrink-0 text-rose-500" />
          <span className="text-rose-500">{'недоплата:'}</span>
          <span className="font-thin">
            {new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
            }).format(claim?.sumUnpaid)}
          </span>
        </div>
      )}
      {claim?.sumDamages && claim?.sumDamages > 0 && (
        <div className="flex flex-row items-center gap-1 ">
          <TicketX className="size-4 flex-shrink-0 text-orange-500" />
          <span className="text-orange-500">{'убытки:'}</span>
          <span className="font-thin">
            {new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
            }).format(claim?.sumDamages)}
          </span>
        </div>
      )}
    </div>
  );
};

export { ClaimMoney };
