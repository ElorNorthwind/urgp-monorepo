import {
  Button,
  cn,
  ScrollArea,
  selectCurrentUser,
  Skeleton,
  store,
} from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { Circle, Pencil } from 'lucide-react';
import { operationTypeStyles } from '../../config/operationStyles';
import { ConfirmationButton } from '@urgp/client/widgets';
import { toast } from 'sonner';
import { useDeleteOperation } from '../../api/operationsApi';

type StageItemProps = {
  stage: ControlStage | null;
  className?: string;
  noHover?: boolean;
  setEditStage?: React.Dispatch<React.SetStateAction<ControlStage | null>>;
};

const StageItem = (props: StageItemProps): JSX.Element => {
  const { className, stage, noHover = false, setEditStage } = props;
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

  return (
    <div
      className={cn(
        'group relative flex w-full flex-col border-b px-4 py-4 last:border-b-0',
        noHover ? 'py-2' : 'py-4',
        stage.payload.approveStatus === 'pending' && 'bg-slate-50',
        stage.payload.approveStatus === 'rejected' && 'bg-red-50',
        className,
      )}
    >
      {noHover && (
        <div className="mb-2 text-amber-500 opacity-80">Текущее состояние</div>
      )}
      <div className="flex items-center justify-start gap-2 text-sm">
        {StageIcon && <StageIcon className={cn('-mr-1 size-4', iconStyle)} />}
        <span
          className={cn(
            'truncate font-bold',
            stage.payload.approveStatus === 'rejected' && 'line-through',
            stage.payload.approveStatus !== 'approved' && 'opacity-70',
          )}
        >
          {stage.payload.type.fullname}
        </span>
        {noHover ? (
          <>
            <span className="ml-auto text-xs">{stage.author.fio}</span>
          </>
        ) : (
          <>
            <span className="ml-auto font-thin">{stage.payload.num}</span>
            <span className={cn('text-muted-foreground')}>
              {format(stage.payload.doneDate, 'dd.MM.yyyy')}
            </span>
          </>
        )}
      </div>
      {noHover && (
        <div className="text-muted-foreground -mx-4 my-1 flex flex-row justify-start gap-1 bg-amber-100 px-4 text-sm">
          {stage.payload.num && (
            <>
              <span className="">от</span>
              <span className="">
                {format(stage.payload.doneDate, 'dd.MM.yyyy')}
              </span>
            </>
          )}
          {stage.payload.num && (
            <>
              <span className="ml-auto">№</span>
              <span className="">{stage.payload.num}</span>
            </>
          )}
        </div>
      )}
      <div className="font-light">{stage.payload.description}</div>
      {stage.payload.approveStatus === 'pending' && (
        <div className="text-muted-foreground">
          <span className="font-medium">На согласовании: </span>
          {stage?.approver?.fio && <span>{stage?.approver?.fio}</span>}
        </div>
      )}
      {stage.payload.approveStatus === 'rejected' && (
        <div className="font-light text-rose-500">
          {stage?.approver?.fio && (
            <span className="font-medium">{stage?.approver?.fio + ': '}</span>
          )}
          <span>{stage.payload.approveNotes}</span>
        </div>
      )}
      {!noHover && (
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
                      description:
                        rejected.data?.message || 'Неизвестная ошибка',
                    }),
                  );
              }}
              disabled={isDeleting}
              label="Удалить?"
            />
          )}
          {(user?.id === stage.author.id ||
            user?.id === stage.payload.approver ||
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
          <span className="mr-1 font-normal">{stage.author.fio}</span>
        </div>
      )}
    </div>
  );
};

export { StageItem };
