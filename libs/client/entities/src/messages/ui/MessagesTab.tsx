import { cn } from '@urgp/client/shared';
import { ExtendedMessage } from '@urgp/shared/entities';
import { MessageElement } from './MessageElement';
import { useApartmentMessages } from '../api/messagesApi';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { MessageList } from './MessageList';
import { CreateMessageForm } from './CreateMessageForm';

type MessageTabProps = {
  apartmentId: number;
  className?: string;
};
const MessageTab = ({
  apartmentId,
  className,
}: MessageTabProps): JSX.Element => {
  const {
    data: messages,
    isLoading,
    isFetching,
    isError,
  } = useApartmentMessages({
    apartmentIds: [apartmentId],
  });

  //   const {
  //     currentData: buildings,
  //     isLoading,
  //     isFetching,
  //   } = useOldBuldings({
  //     ...(debouncedFilters as Partial<GetOldBuldingsDto>),
  //     offset,
  //   });

  return (
    <div
      className={cn(
        'flex h-screen flex-col items-center justify-between p-2',
        className,
      )}
    >
      <ScrollArea className="w-full flex-grow">
        <MessageList messages={messages || []} />
      </ScrollArea>
      <CreateMessageForm apartmentId={apartmentId} />
    </div>
  );
};

export { MessageTab };
