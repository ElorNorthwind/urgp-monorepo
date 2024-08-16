import {
  OldBuildingsCard,
  oldBuildingsColumns,
  unansweredMessagesColumns,
  useOldBuldings,
  useUnansweredMessages,
} from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  cn,
  HStack,
  selectCurrentUser,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  useDebounce,
  VirtualDataTable,
} from '@urgp/client/shared';
import { LoadedResultCounter, OldBuildingsFilter } from '@urgp/client/widgets';
import { useCallback, useState } from 'react';
import { GetOldBuldingsDto, OldBuilding } from '@urgp/shared/entities';
import { useSelector } from 'react-redux';

const MessagesPage = (): JSX.Element => {
  const { tab } = getRouteApi('/renovation/messages').useSearch();
  const user = useSelector(selectCurrentUser);
  const query = tab === 'boss' ? 'boss' : user?.id || 0;
  const {
    data: messages,
    isLoading,
    isFetching,
  } = useUnansweredMessages(query);
  const navigate = useNavigate({ from: '/renovation/messages' });

  return (
    <div className="block space-y-6 p-10">
      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Сообщения</h2>
          <Tabs
            defaultValue="my"
            className="w-[400px]"
            value={tab ?? 'my'}
            onValueChange={(value) => {
              navigate({
                search: { tab: value === 'boss' ? 'boss' : undefined },
              });
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my">Мои вопросы</TabsTrigger>
              <TabsTrigger value="boss">Вопросы босса</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <p className="text-muted-foreground">
          Список сообщений, требующих ответа
        </p>
      </div>

      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <VirtualDataTable
          className={cn(
            'bg-background h-full w-full transition-all ease-in-out',
          )}
          columns={unansweredMessagesColumns}
          data={messages || []}
          // isFetching={true}
          isFetching={isLoading || isFetching}
          totalCount={messages?.length ?? 0}
          enableMultiRowSelection={false}
        />
      </div>
    </div>
  );
};

export { MessagesPage };
