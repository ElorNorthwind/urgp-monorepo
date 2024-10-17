import { CellContext } from '@tanstack/react-table';
import {
  Button,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { PendingStage } from '@urgp/shared/entities';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useApproveStage, usePendingStages } from '../../../api/stagesApi';
import { toast } from 'sonner';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';

function ApproveCell(props: CellContext<PendingStage, unknown>): JSX.Element {
  const stage = props.row.original;
  const [approveStage, { isLoading }] = useApproveStage();
  const { refetch } = usePendingStages();

  async function onSubmit(id: number, approveStatus: 'approved' | 'rejected') {
    approveStage({
      id,
      approveStatus,
      approveNotes: '',
    })
      .unwrap()
      .then(() => {
        refetch && refetch();
        toast.success(
          `Этап ${approveStatus === 'approved' ? 'одобрен' : 'отклонен'}`,
        );
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((rejected: any) =>
        toast.error(
          `Не удалось ${approveStatus === 'approved' ? 'одобрить' : 'отлонить'} этап`,
          {
            description: rejected.data?.message || 'Неизвестная ошибка',
          },
        ),
      );
  }

  return (
    <HStack gap="s" noWrap className="overflow-hidden truncate">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={'default'}
            className="h-10 w-10 bg-rose-800 p-0 hover:bg-rose-700"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              onSubmit(stage.id, 'rejected');
            }}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            <TooltipArrow />
            Отклонить этап
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={'default'}
            className="h-10 w-10 p-0"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              onSubmit(stage.id, 'approved');
            }}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            <TooltipArrow />
            Согласовать этап
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </HStack>
  );
}

export { ApproveCell };
