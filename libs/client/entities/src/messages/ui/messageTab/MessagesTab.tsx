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
import { ExtendedMessage, ExtendedStage } from '@urgp/shared/entities';
import { useApartmentMessages } from '../../api/messagesApi';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { MessageList } from './MessageList';
import { CreateMessageForm } from './CreateMessageForm';
import { useState } from 'react';
import { CreateStageForm } from './CreateStageForm';
import { StageList } from './StageList';
import { useApartmentStages } from '../../api/stagesApi';
import { useApartmentDefects } from '../../../oldApartments';
import { DefectElement } from './DefectElement';

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

  const { data: stages, refetch: refetchStages } = useApartmentStages({
    apartmentIds: [apartmentId],
  });

  const { data: defects } = useApartmentDefects(apartmentId, {
    skip: !apartmentId || apartmentId <= 0,
  });

  const [editMessage, setEditMessage] = useState<ExtendedMessage | null>(null);
  const [editStage, setEditStage] = useState<ExtendedStage | null>(null);

  return (
    <Tabs defaultValue="comments" className={cn('h-full', className)} asChild>
      <Card className="h-full">
        <CardHeader className="border-b p-2">
          <TabsList
            className={cn(
              'grid w-full',
              defects && defects?.length > 0 ? 'grid-cols-3' : 'grid-cols-2',
            )}
          >
            <TabsTrigger value="comments">Сообщения</TabsTrigger>
            <TabsTrigger value="stages">Этапы</TabsTrigger>
            {defects && defects?.length > 0 && (
              <TabsTrigger value="defects">Дефекты</TabsTrigger>
            )}
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
          <ScrollArea className="w-full overflow-auto p-2">
            <StageList
              stages={stages || []}
              refetch={() => {
                refetch();
                refetchAll && refetchAll();
              }}
              editStage={editStage}
              setEditStage={setEditStage}
              className="pointer-events-auto"
            />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <CreateStageForm
            apartmentId={apartmentId}
            refetch={() => {
              refetchStages();
              refetchAll && refetchAll();
            }}
            editStage={editStage}
            setEditStage={setEditStage}
            className="pointer-events-auto"
          />
        </TabsContent>

        <TabsContent
          value="defects"
          className="m-0 grid grid-rows-[1fr_max-content] flex-col bg-slate-100 data-[state=active]:h-[calc(100%-4rem)]"
        >
          <ScrollArea className="w-full overflow-auto p-2">
            {defects && defects?.length > 0 ? (
              defects?.map((defect) => (
                <DefectElement defect={defect} key={defect?.newApartId} />
              ))
            ) : (
              <div className="w-full text-center text-lg">
                Дефектов не выявлено
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export { MessageTab };
