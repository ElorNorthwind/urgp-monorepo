import { cn } from '@urgp/client/shared';
import { AddressSessionFull } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { LoaderCircle } from 'lucide-react';

type SessionQueueItemProps = {
  session: AddressSessionFull;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
};

const SessionQueueItem = (props: SessionQueueItemProps): JSX.Element | null => {
  const { session, className, onClick, selected = false } = props;
  if (!session) return null;

  return (
    <div
      className={cn(
        'bg-background verflow-hidden flex flex-row flex-nowrap items-center rounded-md border px-2 ',
        '[&>*]:p-2 [&>:not(:last-child)]:border-r',
        selected && 'border-slate-400 bg-slate-50',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={() => onClick?.()}
    >
      <span className="font-semibold">{session.id}</span>
      <span>{`${format(session?.createdAt, 'dd.MM.yyyy HH:mm:ss')}`}</span>
      <span className="font-semibold">{`${session.userFio}`}</span>
      <span className="flex flex-grow flex-row items-center gap-2 overflow-hidden">
        <span className="text-muted-foreground">{`[${session?.done}/${session?.total}]`}</span>
        <span className="flex-grow truncate text-sm">
          {session?.title || ''}
        </span>
        {session?.status === 'running' && (
          <LoaderCircle className="ml-auto size-4 flex-shrink-0 animate-spin" />
        )}
      </span>
      <span className="min-w-20 flex-shrink-0 text-center">{`${session?.status}`}</span>
    </div>
  );
};

export { SessionQueueItem };
