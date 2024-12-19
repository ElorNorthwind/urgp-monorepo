import {
  Button,
  cn,
  selectCurrentUser,
  Skeleton,
  store,
} from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { Circle, Pencil } from 'lucide-react';
import {
  approveStatusStyles,
  operationTypeStyles,
} from '../../config/operationStyles';
import { ConfirmationButton } from '@urgp/client/widgets';
import { toast } from 'sonner';
import { useDeleteOperation } from '../../api/operationsApi';
import { StagesHistory } from '../StageHistory';

type StageItemProps = {
  stage: ControlStage | null;
  className?: string;
  setEditStage?: React.Dispatch<React.SetStateAction<ControlStage | null>>;
};

const StageItem = (props: StageItemProps): JSX.Element => {
  const { className, stage, setEditStage } = props;
  const [deleteOperation, { isLoading: isDeleting }] = useDeleteOperation();
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

  const { bgStyle, fontStyle, badgeStyle, label } = approveStatusStyles?.[
    stage.payload.approveStatus
  ] || {
    label: 'Без статуса',
    bgStyle: 'bg-background',
    badgeStyle:
      'border-muted-foreground/50 bg-muted-foreground/5 text-muted-foreground',
    fontStyle: '',
  };

  return (
    <div
      className={cn(
        'group relative flex w-full flex-col border-b p-4 last:border-b-0',
        bgStyle,
        className,
      )}
    >
      <div className="flex items-center justify-start gap-2 text-sm">
        {StageIcon && <StageIcon className={cn('-mr-1 size-4', iconStyle)} />}
        <span className={cn('truncate font-bold', fontStyle)}>
          {stage.payload.type.fullname}
        </span>
        <span className="ml-auto font-thin">{stage.payload.num}</span>
        <span className={cn('text-muted-foreground')}>
          {format(stage.payload.doneDate, 'dd.MM.yyyy')}
        </span>
      </div>
      <div className="font-light">{stage.payload.description}</div>

      <div
        className={cn(
          'mt-2 grid grid-cols-[auto_auto_1fr] gap-1 border-l-4 px-2 py-1',
          badgeStyle,
          stage.payload.approveStatus === 'approved' && 'hidden',
        )}
      >
        <span className="font-medium">{label}</span>
        {(stage?.payload?.approveBy?.fio || stage?.payload?.approver?.fio) && (
          <span className="text-nowrap">
            {': ' +
              (stage?.payload?.approveBy?.fio || stage?.payload?.approver?.fio)}
          </span>
        )}
        {stage?.payload?.approveDate && (
          <span className="ml-auto text-nowrap">
            {format(stage.payload.approveDate, 'dd.MM.yyyy HH:mm')}
          </span>
        )}
        {stage?.payload?.approveNotes && (
          <span className="col-span-3 italic">
            {stage.payload.approveNotes}
          </span>
        )}
      </div>

      <div className="bg-background absolute bottom-3 right-4 hidden flex-row items-center gap-2 rounded-full p-1 text-right text-xs font-thin shadow-sm group-hover:flex">
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

        {(user?.id === stage?.author?.id ||
          user?.id === stage?.payload?.approver?.id ||
          user?.roles.includes('admin')) &&
          stage.payload.approveStatus !== 'rejected' && (
            <Button
              className="size-6 rounded-full p-0"
              variant={'ghost'}
              onClick={() => {
                setEditStage && setEditStage(stage);
              }}
            >
              <Pencil className="size-4" />
            </Button>
          )}
        <span>{format(stage.payload.updatedAt, 'dd.MM.yyyy')}</span>
        <StagesHistory stage={stage} />
        <span className="mr-1 font-normal">{stage.author.fio}</span>
      </div>
    </div>
  );
};

export { StageItem };
