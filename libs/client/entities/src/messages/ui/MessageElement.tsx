import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  cn,
  selectCurrentUser,
} from '@urgp/client/shared';
import { ExtendedMessage } from '@urgp/shared/entities';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useDeleteMessage } from '../api/messagesApi';
import { Trash, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

type MessageElementProps = {
  message: ExtendedMessage;
  refetch: () => void;
  className?: string;
};
const MessageElement = ({
  message,
  refetch,
  className,
}: MessageElementProps): JSX.Element => {
  const user = useSelector(selectCurrentUser);
  const [
    deleteMessage,
    { isLoading: isDeleting, isSuccess: isDeletedSuccess },
  ] = useDeleteMessage();

  // TODO: proper optimistic updates
  if (isDeletedSuccess) {
    return <></>;
  }

  return (
    <Card
      className={cn(
        'relative',
        message.isBoss ? 'border-accent' : '',
        className,
      )}
      key={message.id}
    >
      <CardHeader className="bg-accent/40 py-2 px-6">
        <CardDescription className="bg-accent/40 flex flex-row items-center justify-between">
          <div>{message.authorFio}</div>
          <div>{dayjs(message.updatedAt).format('DD.MM.YYYY')}</div>
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <p>{message.messageContent}</p>
        {(user?.id === message.authorId || user?.roles.includes('admin')) && (
          <Button
            variant="ghost"
            className="absolute right-2 bottom-2 h-6 w-6 rounded-full p-1"
            disabled={isDeleting}
            onClick={() => {
              deleteMessage({ id: message.id });
              toast.success('Сообщение удалено');
              refetch();
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export { MessageElement };
