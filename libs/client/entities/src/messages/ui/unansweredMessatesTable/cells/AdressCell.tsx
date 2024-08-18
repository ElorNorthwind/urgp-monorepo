import { useNavigate } from '@tanstack/react-router';
import { CellContext } from '@tanstack/react-table';
import { Button } from '@urgp/client/shared';
import { UnansweredMessage } from '@urgp/shared/entities';
import { ExternalLink } from 'lucide-react';

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
