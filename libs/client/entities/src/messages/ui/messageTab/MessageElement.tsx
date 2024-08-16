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
import { useDeleteMessage } from '../../api/messagesApi';
import { Speech, Pencil } from 'lucide-react';
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
          ' py-2 px-6',
          editMessage?.id === message.id
            ? 'bg-amber-200'
            : message.authorId === user?.id
              ? 'bg-slate-300/50'
              : 'bg-accent/40',
        )}
      >
        <CardDescription className="flex flex-row items-center justify-between">
          <p className="flex flex-row items-center justify-start gap-2">
            {message.authorFio}
          </p>
          <p className="flex flex-row items-center justify-start gap-2">
            {message.isBoss ? (
              <Speech className="h-4 w-4 text-rose-500" />
            ) : null}
            {dayjs(message.updatedAt).format('DD.MM.YYYY')}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <p>{message.messageContent}</p>
        {!editMessage && (
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {user?.id === message.authorId && setEditMessage && (
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
            {(user?.id === message.authorId ||
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
