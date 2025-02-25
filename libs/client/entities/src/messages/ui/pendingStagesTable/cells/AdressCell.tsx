import { useNavigate } from '@tanstack/react-router';
import { CellContext } from '@tanstack/react-table';
import { Button } from '@urgp/client/shared';
import { PendingStage } from '@urgp/shared/entities';
import { ExternalLink } from 'lucide-react';

function AdressCell(props: CellContext<PendingStage, string>): JSX.Element {
  const stage = props.row.original;
  const navigate = useNavigate({ from: '/renovation/stages' });

  return (
    <div className="flex w-full flex-row items-center justify-start gap-1">
      <Button
        variant="ghost"
        onClick={() =>
          navigate({
            to: `/renovation/oldbuildings`,
            search: { adress: stage.adress },
          })
        }
        className="px-2 py-1"
      >
        <ExternalLink className="h-6 w-6" />
      </Button>
      <div className="flex flex-1 flex-col items-start justify-start truncate">
        <div className="line-clamp-2">{stage.adress}</div>
        <div className="text-muted-foreground line-clamp-1">
          {stage.okrug + ', ' + stage.district}
        </div>
      </div>
    </div>
  );
}

export { AdressCell };
