import { useLocation, useNavigate } from '@tanstack/react-router';
import { cn, Skeleton } from '@urgp/client/shared';
import { useGetSessionsQueue } from '../../api/addressApi';
import { SessionQueueItem } from './SessionQueueItem';

type SessionQueueProps = {
  selectedSessionId?: number;
  className?: string;
};

const SessionQueue = (props: SessionQueueProps): JSX.Element | null => {
  const { className, selectedSessionId } = props;
  const pathname = useLocation().pathname;
  const navigate = useNavigate({ from: pathname });

  const { data, isLoading } = useGetSessionsQueue(undefined, {
    pollingInterval: 5000,
  });

  if (!data || data?.length === 0 || isLoading) return null;

  return (
    <div
      className={cn('items-ceter flex flex-col justify-start gap-2', className)}
    >
      <span className="text-xl font-semibold">Очередь запросов:</span>
      {data.map((session) => {
        const isSelected = selectedSessionId === session.id;
        return (
          <SessionQueueItem
            key={session.id}
            session={session}
            selected={isSelected}
            onClick={
              isSelected
                ? undefined
                : () =>
                    navigate({
                      to: pathname,
                      search: { sessionId: session.id },
                    })
            }
          />
        );
      })}
    </div>
  );
};

export { SessionQueue };
