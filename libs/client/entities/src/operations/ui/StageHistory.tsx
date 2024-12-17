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
import { ControlStage } from '@urgp/shared/entities';
import { StageItem } from './StagesList/StageItem';
import { History } from 'lucide-react';
import { useOperationPayloadHistroy } from '../api/operationsApi';

type StagesHistoryProps = {
  stage: ControlStage;
  className?: string;
};

const StagesHistory = (props: StagesHistoryProps): JSX.Element => {
  const { className, stage } = props;
  const {
    data: payloadHistory,
    isLoading,
    isFetching,
  } = useOperationPayloadHistroy(stage.id);
  if (stage?.version === 1) return <></>;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="size-6 rounded-full p-0">
          <History className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>История изменений</DialogTitle>
          <DialogDescription>Внесенных по этапу</DialogDescription>
        </DialogHeader>

        <ScrollArea
          className={cn(
            'bg-background flex flex-col gap-2 rounded border',
            'max-h-[calc(100vh-12rem)]',
            className,
          )}
        >
          {isLoading || isFetching || !payloadHistory ? (
            <StageItem stage={null} />
          ) : (
            payloadHistory?.map((payload, index) => (
              <StageItem
                stage={{
                  ...stage,
                  payload: payload as ControlStage['payload'],
                }}
                key={stage.id + '-' + index}
              />
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export { StagesHistory };
