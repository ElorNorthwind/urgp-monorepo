import {
  unansweredMessagesColumns,
  useUnansweredMessages,
} from '@urgp/client/entities';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  cn,
  selectCurrentUser,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  VirtualDataTable,
} from '@urgp/client/shared';
import { useSelector } from 'react-redux';
import { MessagesPageSearch } from '@urgp/shared/entities';
import { OldApartmentDetailsSheet } from '@urgp/client/widgets';

const MessagesPage = (): JSX.Element => {
  const { tab, message } = getRouteApi('/renovation/messages').useSearch();
  const user = useSelector(selectCurrentUser);

  const query = tab === 'boss' ? 'boss' : tab === 'all' ? 'all' : user?.id || 0;

  const {
    data: messages,
    isLoading,
    isFetching,
    refetch,
  } = useUnansweredMessages(query);
  const navigate = useNavigate({ from: '/renovation/messages' });

  const currentApartmentId = messages?.find(
    (m) => m.id === message,
  )?.apartmentId;

  return (
    <div className="block space-y-6 p-10 pb-2">
      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Сообщения</h2>
          <Tabs
            defaultValue="my"
            className=""
            value={tab ?? 'my'}
            onValueChange={(value) => {
              navigate({
                search: { tab: value === 'my' ? undefined : value },
              });
            }}
          >
            <TabsList className={cn('grid w-full grid-flow-col')}>
              <TabsTrigger value="my">Мои вопросы</TabsTrigger>
              {user && !user.roles.includes('boss') && (
                <TabsTrigger value="boss">Вопросы руководителя</TabsTrigger>
              )}
              {user &&
                ['admin', 'editor', 'boss'].filter((role) =>
                  user.roles.includes(role),
                ).length > 0 && (
                  <TabsTrigger value="all">Все вопросы</TabsTrigger>
                )}
            </TabsList>
          </Tabs>
        </div>
        <p className="text-muted-foreground">
          Список сообщений, требующих ответа
        </p>
      </div>

      <Separator className="my-6" />
      <div
        className={cn(
          'relative w-full space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0',
        )}
      >
        <VirtualDataTable
          className={cn(
            'bg-background absolute left-0 h-[calc(100vh-13rem)] flex-1 transition-all ease-in-out',
            message
              ? 'w-[calc(100%-var(--messagebar-width)-var(--detailsbar-width)-1.0rem)]'
              : 'w-[calc(100%)]',
          )}
          columns={unansweredMessagesColumns}
          data={messages || []}
          isFetching={isLoading || isFetching}
          totalCount={messages?.length ?? 0}
          enableMultiRowSelection={false}
          onRowClick={(row) => {
            row.toggleSelected();
            navigate({
              search: (prev: MessagesPageSearch) => ({
                ...prev,
                message:
                  message === row.original.id ? undefined : row.original.id,
              }),
            });
          }}
        />
        {currentApartmentId && (
          <OldApartmentDetailsSheet
            apartmentId={currentApartmentId}
            className="right-0"
            refetch={refetch}
            setApartmentId={() =>
              navigate({
                search: (prev: MessagesPageSearch) => ({
                  ...prev,
                  message: undefined,
                }),
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export { MessagesPage };
