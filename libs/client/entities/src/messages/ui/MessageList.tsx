import { cn } from '@urgp/client/shared';
import { ExtendedMessage } from '@urgp/shared/entities';
import { MessageElement } from './MessageElement';

type MessageListProps = {
  messages: ExtendedMessage[] | null;
  className?: string;
};
const MessageList = ({
  messages = [],
  className,
}: MessageListProps): JSX.Element => {
  return (
    <div className={cn('flex flex-row gap-2', className)}>
      {!messages || messages?.length === 0 ? (
        <h1 className="text-background w-full text-center">Нет сообщений</h1>
      ) : (
        messages.map((message) => {
          return (
            <MessageElement
              key={message.id}
              message={message}
              className="w-full"
            />
          );
        })
      )}
    </div>
  );
};

export { MessageList };
