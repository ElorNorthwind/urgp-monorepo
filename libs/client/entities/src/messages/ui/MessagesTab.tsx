import { cn, ScrollBar, Skeleton } from '@urgp/client/shared';
import { ExtendedMessage } from '@urgp/shared/entities';
import { MessageElement } from './MessageElement';
import { useApartmentMessages } from '../api/messagesApi';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { MessageList } from './MessageList';
import { CreateMessageForm } from './CreateMessageForm';
import { useState } from 'react';

type MessageTabProps = {
  apartmentId: number;
  refetchAll?: () => void;
  className?: string;
};
const MessageTab = ({
  apartmentId,
  refetchAll,
  className,
}: MessageTabProps): JSX.Element => {
  const {
    data: messages,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useApartmentMessages({
    apartmentIds: [apartmentId],
  });
  const [editMessage, setEditMessage] = useState<ExtendedMessage | null>(null);

  return (
    <div
      className={cn(
        'pointer-events-none flex h-screen flex-col items-center justify-between gap-2 p-2',
        className,
      )}
    >
      <ScrollArea className="w-full flex-1 overflow-auto">
        <MessageList
          messages={messages || []}
          refetch={() => {
            refetch();
            refetchAll && refetchAll();
          }}
          editMessage={editMessage}
          setEditMessage={setEditMessage}
          className="pointer-events-auto"
        />
        {/* {isLoading || isFetching ? <Skeleton className="h-11 w-full" /> : null} */}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <CreateMessageForm
        apartmentId={apartmentId}
        refetch={() => {
          refetch();
          refetchAll && refetchAll();
        }}
        editMessage={editMessage}
        setEditMessage={setEditMessage}
        className="pointer-events-auto"
      />
    </div>
  );
};

export { MessageTab };
