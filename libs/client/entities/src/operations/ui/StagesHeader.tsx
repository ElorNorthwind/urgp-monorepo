import { Button, cn, ScrollArea, Skeleton } from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { SquarePlay, SquarePlus } from 'lucide-react';

type StagesHeaderProps = {
  caseId?: number;
  className?: string;
};

const StagesHeader = (props: StagesHeaderProps): JSX.Element => {
  const { caseId, className } = props;

  if (!caseId) return <></>;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="font-medium">Работа с делом</div>
      <Button variant={'outline'} className="h-8 p-1 pr-2">
        <SquarePlus className="mr-1 size-4 flex-shrink-0" />
        <span>Новый этап</span>
      </Button>
    </div>
  );
};

export { StagesHeader };
