import { useNavigate } from '@tanstack/react-router';
import { CellContext } from '@tanstack/react-table';
import { Button } from '@urgp/client/shared';
import { CaseWithStatus, UnansweredMessage } from '@urgp/shared/entities';
import { ExternalLink } from 'lucide-react';

function ApplicantCell(
  props: CellContext<CaseWithStatus, string>,
): JSX.Element {
  const payload = props.row.original.payload;
  // const navigate = useNavigate({ from: '/control/cases' });

  return (
    <div className="flex w-full flex-row items-center justify-start gap-1">
      {/* <Button
        variant="ghost"
        onClick={() =>
          navigate({
            to: `/renovation/oldbuildings`,
            search: { adress: message.adress },
          })
        }
        className="px-2 py-1"
      >
        <ExternalLink className="h-6 w-6" />
      </Button> */}
      <div className="flex flex-1 flex-col items-start justify-start truncate">
        <div className="truncate">{payload.fio}</div>
        <div className="text-muted-foreground line-clamp-1">
          {payload.adress}
        </div>
      </div>
    </div>
  );
}

export { ApplicantCell };
