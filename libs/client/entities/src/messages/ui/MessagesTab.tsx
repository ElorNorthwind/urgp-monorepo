import { cn, ScrollBar } from '@urgp/client/shared';
import { ExtendedMessage } from '@urgp/shared/entities';
import { MessageElement } from './MessageElement';
import { useApartmentMessages } from '../api/messagesApi';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { MessageList } from './MessageList';
import { CreateMessageForm } from './CreateMessageForm';

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
          className="pointer-events-auto"
        />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <CreateMessageForm
        apartmentId={apartmentId}
        refetch={() => {
          refetch();
          refetchAll && refetchAll();
        }}
        className="pointer-events-auto"
      />
    </div>
  );
};

export { MessageTab };
