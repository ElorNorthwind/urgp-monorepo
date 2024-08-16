import { useNavigate } from '@tanstack/react-router';
import { CellContext } from '@tanstack/react-table';
import { Badge, Button, cn, HStack, VStack } from '@urgp/client/shared';
import { UnansweredMessage } from '@urgp/shared/entities';
import {
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  CircleEllipsis,
  CircleX,
  ExternalLink,
} from 'lucide-react';
import { useMemo } from 'react';
const problemBadgeStyles = {
  МФР: cn('bg-violet-100 border-violet-200'),
  Отказ: cn('bg-amber-100 border-amber-200'),
  Суды: cn('bg-rose-100 border-rose-200'),
  Проблемная: cn('bg-slate-100 border-slate-200'),
};

function AdressCell(
  props: CellContext<UnansweredMessage, string>,
): JSX.Element {
  const message = props.row.original;
  const navigate = useNavigate({ from: '/renovation/messages' });

  return (
    <div className="flex w-full flex-row items-center justify-start gap-1">
      <Button
        variant="ghost"
        onClick={() =>
          navigate({
            to: `/renovation/oldbuildings`,
            search: { adress: message.adress },
          })
        }
        className="py-1 px-2"
      >
        <ExternalLink className="h-6 w-6" />
      </Button>
      <div className="flex flex-1 flex-col items-start justify-start truncate">
        <div className="line-clamp-2">{message.adress}</div>
        <div className="line-clamp-1 text-muted-foreground">
          {message.okrug + ', ' + message.district}
        </div>
      </div>
    </div>
  );
}

export { AdressCell };
