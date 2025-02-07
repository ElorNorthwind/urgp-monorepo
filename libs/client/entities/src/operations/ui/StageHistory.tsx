import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@urgp/client/shared';
import { History } from 'lucide-react';
import { StageHistoryItem } from './StagesList/StageHistoryItem';
import { useState } from 'react';
import { useOperationHistory } from '../api/operationsApi';

type StagesHistoryProps = {
  stageId: number;
  className?: string;
};

const DIALOG_WIDTH = '700px';

const StagesHistory = (props: StagesHistoryProps): JSX.Element => {
  const { className, stageId } = props;
  const [open, setOpen] = useState(false);

  const {
    data: payloadHistory,
    isLoading,
    isFetching,
  } = useOperationHistory(stageId, { skip: !open });

  // if (stage?.version === 1) return <></>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="size-6 rounded-full p-0">
          <History className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(`w-[${DIALOG_WIDTH}] max-w-[100vw]`)}>
        <DialogHeader>
          <DialogTitle>История изменений</DialogTitle>
          <DialogDescription>Внесенных по этапу</DialogDescription>
        </DialogHeader>

        <ScrollArea
          className={cn(
            'bg-background flex w-full flex-col gap-2 rounded border',
            'max-h-[calc(100vh-12rem)]',
            className,
          )}
        >
          {isLoading || isFetching || !payloadHistory ? (
            <StageHistoryItem item={null} />
          ) : (
            payloadHistory
              .filter((item) => item.class === 'stage')
              ?.map((item, index) => (
                <StageHistoryItem item={item} key={stageId + '-' + index} />
              ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export { StagesHistory };
