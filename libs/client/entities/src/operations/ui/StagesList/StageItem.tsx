import {
  cn,
  ScrollArea,
  selectCurrentUser,
  Skeleton,
  store,
} from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { Circle, Coffee } from 'lucide-react';
import { operationTypeStyles } from '../../config/operationStyles';
import { ConfirmationButton } from '@urgp/client/widgets';
import { toast } from 'sonner';
import { useDeleteOperation } from '../../api/operationsApi';

type StageItemProps = {
  stage: ControlStage | null;
  className?: string;
};

const StageItem = (props: StageItemProps): JSX.Element => {
  const { className, stage } = props;
  const [
    deleteOperation,
    { isLoading: isDeleting, isSuccess: isDeletedSuccess },
  ] = useDeleteOperation();
  const user = selectCurrentUser(store.getState());

  if (stage === null) {
    return <Skeleton className="h-8 w-full" />;
  }

  const { icon: StageIcon, iconStyle } = operationTypeStyles?.[
    stage.payload.type.id
  ] || {
    icon: Circle,
    iconStyle: 'text-muted-foreground/40',
  };

  return (
    <div
      className={cn(
        'group relative flex w-full flex-col border-b px-4 py-4 last:border-b-0',
        className,
      )}
    >
      <div className="flex items-center justify-start gap-2 text-sm">
        {StageIcon && <StageIcon className={cn('-mr-1 size-4', iconStyle)} />}
        <span className="truncate font-bold">
          {stage.payload.type.fullname}
        </span>
        <span className="ml-auto font-thin">{stage.payload.num}</span>
        <span className="text-muted-foreground">
          {format(stage.payload.doneDate, 'dd.MM.yyyy')}
        </span>
      </div>
      <div className="font-light">{stage.payload.description}</div>
      <div className="bg-background absolute bottom-2 right-1 hidden flex-row items-center gap-2 rounded-full px-2 py-0 text-right text-xs font-thin group-hover:flex">
        {user?.id === stage.author.id && (
          <ConfirmationButton
            onAccept={() => {
              deleteOperation({
                id: stage.id,
              })
                .unwrap()
                .then(() => {
                  toast.success('Операция удалена');
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .catch((rejected: any) =>
                  toast.error('Не удалось Удалить операцию', {
                    description: rejected.data?.message || 'Неизвестная ошибка',
                  }),
                );
            }}
            disabled={isDeleting}
            label="Удалить?"
          />
        )}
        <span>{stage.author.fio}</span>
      </div>
    </div>
  );
};

export { StageItem };
