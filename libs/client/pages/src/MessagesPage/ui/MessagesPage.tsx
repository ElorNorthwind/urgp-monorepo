import {
  OldBuildingsCard,
  oldBuildingsColumns,
  useOldBuldings,
  useUnansweredMessages,
} from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  cn,
  HStack,
  selectCurrentUser,
  Separator,
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
    isError,
  } = useUnansweredMessages(query);

  return (
    <div className="block space-y-6 p-10">
      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Сообщения</h2>
        </div>
        <p className="text-muted-foreground">
          Список сообщений, требующих ответа
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="grid w-full grid-cols-3 gap-6 lg:grid-cols-5">
          messages {tab}
          {messages?.map((message) => <p>{message.messageContent}</p>)}
        </div>
      </div>
    </div>
  );
};

export { MessagesPage };
