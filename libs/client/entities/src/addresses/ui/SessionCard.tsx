import {
  BarRow,
  ExportAddressResultButton,
  InfoBox,
} from '@urgp/client/features';
import { cn } from '@urgp/client/shared';
import {
  AddressSessionFull,
  AddressSessionStatuses,
} from '@urgp/shared/entities';
import { format } from 'date-fns';
import { LoaderCircle } from 'lucide-react';
import { sessionStatusStyles } from '../config/sessionStyles';
import { SessionStatusChart } from './SessionStatusChart';

type SessionCardProps = {
  session: AddressSessionFull;
  className?: string;
};

const SessionCard = (props: SessionCardProps): JSX.Element | null => {
  const { session, className } = props;

  const {
    label: statusLabel,
    icon: Icon,
    iconStyle,
  } = sessionStatusStyles[
    (session?.status as keyof typeof sessionStatusStyles) || 'pending'
  ] || Object.entries(sessionStatusStyles)[0];

  if (!session) return null;

  return (
    <div
      className={cn(
        'shadow-card bg-background flex flex-row justify-start gap-6 rounded-lg border p-6',
        className,
      )}
    >
      <SessionStatusChart session={session} className="-m-6 size-[12rem]" />
      <div className="flex flex-grow flex-col gap-2">
        <div className="flex flex-row gap-2">
          <InfoBox label="ID:" value={session?.id} className="flex-grow-0" />
          <InfoBox
            label="Создано:"
            value={format(session?.createdAt, 'dd.MM.yyyy HH:MM')}
            className="flex-grow-0"
          />
          <InfoBox
            label="Название:"
            value={session?.title || '-'}
            className="flex-grow"
          />
          <InfoBox
            label="Статус:"
            value={statusLabel || '-'}
            className="flex-grow-0"
          />
        </div>
        {session?.notes && (
          <InfoBox
            label="Примечания:"
            value={session?.notes || '-'}
            className="w-full"
          />
        )}
        <div className="flex gap-2">
          <InfoBox
            label="Выполнено:"
            value={`${session?.done || 0} из ${session?.total || 0}`}
            className="flex-grow"
          />
          <InfoBox
            label="Успешно:"
            value={session?.good || 0}
            className="flex-grow"
          />
          <InfoBox
            label="Сомнительно:"
            value={session?.questionable || 0}
            className="flex-grow"
          />
          <InfoBox
            label="Не найдено:"
            value={session?.error || 0}
            className="flex-grow"
          />
        </div>
        {session.status === AddressSessionStatuses.pending &&
        session?.queue &&
        session?.queue > 0 ? (
          <div className="bg-muted-foreground/5 flex flex-row items-center gap-2 rounded p-2">
            <LoaderCircle className="size-5 flex-shrink-0 animate-spin" />
            <span>{`Адресов в очереди: ${session.queue}`}</span>
          </div>
        ) : null}
        {session.status === AddressSessionStatuses.running ? (
          <BarRow
            value={session?.done || 0}
            max={session?.total || 0}
            label={
              <>
                <LoaderCircle className="size-5 flex-shrink-0 animate-spin" />
                <span>{`${session?.done || 0} из ${session?.total || 0} - (${session?.status})`}</span>
              </>
            }
            labelFit="full"
            className={cn('bg-muted-foreground/10 h-10 w-full')}
            barClassName={cn('bg-slate-400 animate-pulse')}
          />
        ) : null}
        {session.status === AddressSessionStatuses.done ? (
          <ExportAddressResultButton
            sessionId={session?.id || 0}
            // variant={'default'}
          />
        ) : null}
      </div>
    </div>
  );
};

export { SessionCard };
