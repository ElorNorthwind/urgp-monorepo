import {
  Card,
  CardHeader,
  cn,
  ScrollBar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@urgp/client/shared';
import { ExtendedMessage } from '@urgp/shared/entities';
import { useApartmentMessages } from '../../api/messagesApi';
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
  const { data: messages, refetch } = useApartmentMessages({
    apartmentIds: [apartmentId],
  });
  const [editMessage, setEditMessage] = useState<ExtendedMessage | null>(null);

  return (
    <Tabs defaultValue="comments" className={cn('h-full', className)} asChild>
      <Card className="h-full">
        <CardHeader className="border-b p-2">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger value="comments">Сообщения</TabsTrigger>
            <TabsTrigger value="stages" disabled>
              Этапы
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <TabsContent
          value="comments"
          className="m-0 grid grid-rows-[1fr_max-content] flex-col bg-slate-100 data-[state=active]:h-[calc(100%-4rem)]"
        >
          <ScrollArea className="w-full overflow-auto p-2">
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
        </TabsContent>
        <TabsContent
          value="stages"
          className="m-0 grid grid-rows-[1fr_max-content] flex-col bg-slate-100 data-[state=active]:h-[calc(100%-4rem)]"
        >
          <div className="p-2">TBD</div>
          <div className="bg-background border-t p-2">TBD</div>
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export { MessageTab };
