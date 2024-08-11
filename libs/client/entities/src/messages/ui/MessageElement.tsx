import {
  Button,
  Card,
  CardContent,
  CardHeader,
  cn,
  selectCurrentUser,
} from '@urgp/client/shared';
import { ExtendedMessage } from '@urgp/shared/entities';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useDeleteMessage } from '../api/messagesApi';
import { X } from 'lucide-react';

type MessageElementProps = {
  message: ExtendedMessage;
  className?: string;
};
const MessageElement = ({
  message,
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
    <Card className={cn(message.isBoss ? 'border-accent' : '', className)}>
      <CardHeader className="bg-accent/40 flex flex-col items-center justify-between pb-3">
        <div>{message.authorFio}</div>
        <div>{dayjs(message.updatedAt).format('DD.MM.YYYY')}</div>
      </CardHeader>
      <CardContent className="">
        <p>{message.messageContent}</p>
        {(user?.id === message.authorId || user?.roles.includes('admin')) && (
          <Button
            variant="ghost"
            className="absolute right-2 top-2"
            disabled={isDeleting}
            onClick={() => deleteMessage({ id: message.id })}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export { MessageElement };
