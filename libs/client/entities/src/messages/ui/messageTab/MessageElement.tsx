import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  cn,
  selectCurrentUser,
} from '@urgp/client/shared';
import { ExtendedMessage, Message } from '@urgp/shared/entities';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useDeleteMessage, useUpdateMessage } from '../../api/messagesApi';
import { Pencil, FileQuestion, FileCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { DeleteMessageButton } from './DeleteMessageButton';

type MessageElementProps = {
  message: ExtendedMessage;
  refetch: () => void;
  className?: string;
  editMessage?: Message | null;
  setEditMessage?: React.Dispatch<React.SetStateAction<ExtendedMessage | null>>;
};
const MessageElement = ({
  message,
  refetch,
  className,
  editMessage,
  setEditMessage,
}: MessageElementProps): JSX.Element | null => {
  const user = useSelector(selectCurrentUser);

  const [
    deleteMessage,
    { isLoading: isDeleting, isSuccess: isDeletedSuccess },
  ] = useDeleteMessage();
  const [updateMessage] = useUpdateMessage();

  // TODO: proper optimistic updates
  if (isDeletedSuccess) {
    return null;
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition',
        editMessage?.id === message.id
          ? 'scale-95 border-amber-400 bg-amber-100'
          : message.authorId === user?.id
            ? 'bg-slate-200'
            : '',
        className,
      )}
      key={message.id}
    >
      <CardHeader
        className={cn(
          'py-2 px-2',
          editMessage?.id === message.id
            ? 'bg-amber-200'
            : message.authorId === user?.id
              ? 'bg-slate-300/50'
              : 'bg-accent/40',
        )}
      >
        <CardDescription className="flex flex-row items-center justify-between">
          <span
            className={cn('flex flex-row items-center justify-start gap-1')}
          >
            {message.isBoss && <ShieldAlert className="h-4 w-4" />}
            {message.authorFio}
          </span>

          {message.needsAnswer && (
            <span className="ml-auto mr-1 flex items-center gap-1">
              {user?.id === message.authorId && (
                <Button
                  variant="ghost"
                  className="h-6 px-1"
                  onClick={() =>
                    updateMessage({
                      ...message,
                      answerDate: message.answerDate ? null : new Date(),
                    })
                      .unwrap()
                      .then(() => {
                        refetch && refetch();
                        toast.success('Возвращено на контроль');
                      })
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .catch((rejected: any) =>
                        toast.error('Не удалось вернуть на контроль', {
                          description:
                            rejected.data?.message || 'Неизвестная ошибка',
                        }),
                      )
                  }
                >
                  {message.answerDate
                    ? 'вернуть на контроль'
                    : 'снять контроль'}
                </Button>
              )}
              {message.answerDate ? (
                <FileCheck className="h-4 w-4 text-emerald-600" />
              ) : (
                <FileQuestion className="h-4 w-4 text-amber-600" />
              )}
            </span>
          )}
          <span className="flex flex-row items-center justify-start gap-2">
            {dayjs(message.updatedAt).format('DD.MM.YYYY')}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <p className="break-words">
          {message.messageContent
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
        {!editMessage && (
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {user?.id === message.authorId &&
              (user.roles.includes('boss') ||
                user.roles.includes('admin') ||
                user.roles.includes('editor')) &&
              setEditMessage && (
                <Button
                  variant="ghost"
                  className="h-6 w-6 rounded-full p-1"
                  onClick={() => {
                    setEditMessage(message);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            {((user?.id === message.authorId &&
              (user.roles.includes('boss') || user.roles.includes('editor'))) ||
              user?.roles.includes('admin')) && (
              <DeleteMessageButton
                disabled={isDeleting}
                onAccept={() => {
                  deleteMessage({ id: message.id });
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

export { MessageElement };
