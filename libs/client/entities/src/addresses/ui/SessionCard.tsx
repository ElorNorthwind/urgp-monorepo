import {
  BarRow,
  DeleteAddressSessionButton,
  ExportAddressResultButton,
  InfoBox,
  ResetAddressErrorsButton,
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
        <div className="flex flex-shrink-0 flex-row items-center gap-2">
          {/* {Icon && <Icon className={cn('size-10', iconStyle)} />} */}
          <div className="flex flex-col items-start justify-center gap-0">
            <div className="text-xl font-semibold">{session?.title}</div>
            <div className="text-muted-foreground text-xs">
              <span className="mr-1">{`[#${session?.id}]`}</span>
              <span>
                {'от ' + format(session?.createdAt, 'dd.MM.yyyy HH:MM')}
              </span>
            </div>
          </div>
          <div className="ml-auto text-2xl">{statusLabel}</div>
          {Icon && <Icon className={cn('size-10', iconStyle)} />}
        </div>
        <div className="flex w-full gap-2">
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
        {session?.notes && (
          <InfoBox
            label="Примечания:"
            value={session?.notes || '-'}
            className="w-full"
          />
        )}

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
                <span>{`${session?.done || 0} из ${session?.total || 0}`}</span>
              </>
            }
            labelFit="full"
            className={cn('bg-muted-foreground/10 h-10 w-full')}
            barClassName={cn('bg-slate-400 animate-pulse')}
          />
        ) : null}
        {session.status === AddressSessionStatuses.done ? (
          <div className="flex w-full flex-row justify-end gap-2">
            <DeleteAddressSessionButton session={session} />
            <ResetAddressErrorsButton session={session} />
            <ExportAddressResultButton session={session} variant="default" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export { SessionCard };
