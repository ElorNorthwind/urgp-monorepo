import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  cn,
  selectCurrentUser,
  Separator,
} from '@urgp/client/shared';
import { ExtendedStage, Stage } from '@urgp/shared/entities';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { DeleteMessageButton } from './DeleteMessageButton';
import { useDeleteStage } from '../../api/stagesApi';
import { ApproveStageForm } from './ApproveStageForm';

type StageElementProps = {
  stage: ExtendedStage;
  refetch: () => void;
  className?: string;
  editStage?: Stage | null;
  setEditStage?: React.Dispatch<React.SetStateAction<ExtendedStage | null>>;
};

const approveText = {
  approved: '',
  pending: 'Ожидает подтверждения',
  rejected: 'Отклонено',
};
const StageElement = ({
  stage,
  refetch,
  className,
  editStage,
  setEditStage,
}: StageElementProps): JSX.Element | null => {
  const user = useSelector(selectCurrentUser);

  const [deleteStage, { isLoading: isDeleting, isSuccess: isDeletedSuccess }] =
    useDeleteStage();
  // const [updateStage] = useUpdateStage();

  // TODO: proper optimistic updates
  if (isDeletedSuccess) {
    return null;
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition',
        editStage?.id === stage.id
          ? 'scale-95 border-amber-400 bg-amber-100'
          : stage.authorId === user?.id
            ? 'bg-slate-200'
            : '',
        className,
      )}
      key={stage.id}
    >
      <CardHeader
        className={cn(
          'py-2 px-2',
          editStage?.id === stage.id
            ? 'bg-amber-200'
            : stage.authorId === user?.id
              ? ''
              : 'bg-accent/40',
        )}
      >
        <CardDescription className="flex flex-row items-center justify-between">
          <span
            className={cn('flex flex-row items-center justify-start gap-1')}
          >
            {stage.authorFio}
          </span>
          {/* <span
            className={cn(
              stage.approveStatus === 'rejected' && 'text-red-500',
              stage.approveStatus === 'pending' && 'text-amber-500',
            )}
          >
            {approveText[stage.approveStatus]}
          </span> */}
          <ApproveStageForm stage={stage} refetch={refetch} />
          <span className="flex flex-row items-center justify-start gap-2">
            {dayjs(stage.createdAt).format('DD.MM.YYYY')}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent
        className={cn(
          'w-full p-0',
          stage.approveStatus !== 'approved' && 'opacity-30',
        )}
      >
        <div className="grid w-full grid-cols-[max-content_1fr] gap-0">
          <Separator className="col-span-2 border-t opacity-50" />
          <p
            className={cn(
              stage.authorId === user?.id
                ? 'bg-background/60'
                : 'bg-muted-foreground/5',
              'nowrap text-muted-foreground px-2 py-1 text-sm',
            )}
          >
            {stage.group}
          </p>
          <p className="bg-background/40 nowrap truncate px-2 py-1 text-sm">
            {stage.stageName}
          </p>
          <Separator className="col-span-2 border-t opacity-50" />
          <p
            className={cn(
              stage.authorId === user?.id
                ? 'bg-background/60'
                : 'bg-muted-foreground/5',
              'nowrap text-muted-foreground px-2 py-1 text-sm',
            )}
          >
            от {dayjs(stage.docDate).format('DD.MM.YYYY')}
          </p>
          <p className="bg-background/40 nowrap truncate px-2 py-1 text-sm">
            № {stage.docNumber}
          </p>
          <Separator className="col-span-2 border-t opacity-50" />
          {stage.messageContent && (
            <p className="col-span-2 break-words px-2 py-1 text-sm">
              {stage.messageContent
                .replace(/(?:\r\n|\r|\n)/g, '\\n')
                .split('\\n')
                .map((item, index) => {
                  return (
                    <span key={index}>
                      {item}
                      <br />
                    </span>
                  );
                })}
            </p>
          )}
        </div>
        {!editStage && (
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {user?.id === stage.authorId &&
              (user.roles.includes('boss') ||
                user.roles.includes('admin') ||
                user.roles.includes('editor')) &&
              setEditStage && (
                <Button
                  variant="ghost"
                  className="h-6 w-6 rounded-full p-1"
                  onClick={() => {
                    setEditStage(stage);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            {((user?.id === stage.authorId &&
              (user.roles.includes('boss') || user.roles.includes('editor'))) ||
              user?.roles.includes('admin')) && (
              <DeleteMessageButton
                disabled={isDeleting}
                onAccept={() => {
                  deleteStage({ id: stage.id });
                  toast.success('Сообщение удалено');
                  refetch();
                }}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { StageElement };
