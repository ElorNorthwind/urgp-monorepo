import { cn } from '@urgp/client/shared';
import { ExtendedMessage, Message } from '@urgp/shared/entities';
import { MessageElement } from './MessageElement';

type MessageListProps = {
  messages: ExtendedMessage[] | null;
  refetch: () => void;
  className?: string;
  editMessage?: Message | null;
  setEditMessage?: React.Dispatch<React.SetStateAction<ExtendedMessage | null>>;
};
const MessageList = ({
  messages = [],
  refetch,
  className,
  editMessage,
  setEditMessage,
}: MessageListProps): JSX.Element => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {!messages || messages?.length === 0 ? (
        <h1 className="w-full rounded border border-dashed p-8 text-center">
          Нет сообщений
        </h1>
      ) : (
        messages.map((message) => {
          return (
            <MessageElement
              refetch={refetch}
              key={message.id}
              message={message}
              className="w-full"
              editMessage={editMessage}
              setEditMessage={setEditMessage}
            />
          );
        })
      )}
    </div>
  );
};

export { MessageList };
