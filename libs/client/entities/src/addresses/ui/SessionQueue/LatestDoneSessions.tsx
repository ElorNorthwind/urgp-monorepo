import { useLocation, useNavigate } from '@tanstack/react-router';
import { cn, Skeleton } from '@urgp/client/shared';
import { useGetSessionsQueue, useGetUserSessions } from '../../api/addressApi';
import { SessionQueueItem } from './SessionQueueItem';

type LatestDoneSessionsProps = {
  selectedSessionId?: number;
  className?: string;
  sessionLimit?: number;
};

const LatestDoneSessions = (
  props: LatestDoneSessionsProps,
): JSX.Element | null => {
  const { className, selectedSessionId, sessionLimit = 5 } = props;
  const pathname = useLocation().pathname;
  const navigate = useNavigate({ from: pathname });

  const { data, isLoading } = useGetUserSessions(undefined, {
    pollingInterval: 5000,
  });

  const filteredSessions =
    data
      ?.filter((session) => session.status === 'done')
      .slice(0, sessionLimit) || [];

  if (!filteredSessions || filteredSessions?.length === 0 || isLoading)
    return null;

  return (
    <div
      className={cn('items-ceter flex flex-col justify-start gap-2', className)}
    >
      <span className="text-xl font-semibold">
        Мои последние выполненные запросы:
      </span>
      {filteredSessions.map((session) => {
        const isSelected = selectedSessionId === session.id;
        return (
          <SessionQueueItem
            key={session.id}
            session={session}
            selected={isSelected}
            onClick={() =>
              navigate({
                to: pathname,
                search: { sessionId: isSelected ? undefined : session.id },
              })
            }
          />
        );
      })}
    </div>
  );
};

export { LatestDoneSessions };
