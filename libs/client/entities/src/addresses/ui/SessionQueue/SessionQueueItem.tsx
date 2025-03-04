import { cn } from '@urgp/client/shared';
import { AddressSessionFull } from '@urgp/shared/entities';
import { format } from 'date-fns';

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
      <span className="flex-grow truncate">{session?.title || ''}</span>
      <span className="w-20">{`${session?.status}`}</span>
      <span>{`[${session?.done}/${session?.total}]`}</span>
    </div>
  );
};

export { SessionQueueItem };
