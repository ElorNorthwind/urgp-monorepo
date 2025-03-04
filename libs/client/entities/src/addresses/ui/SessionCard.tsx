import {
  BarRow,
  ExportAddressResultButton,
  InfoBox,
} from '@urgp/client/features';
import { Accordion, cn } from '@urgp/client/shared';
import {
  CaseInfoTab,
  CaseNotesTab,
  ConnectedCasesTab,
  DispatchesTab,
  ExternalCasesTab,
} from '@urgp/client/widgets';
import {
  AddressSessionFull,
  CaseFull,
  OperationClasses,
} from '@urgp/shared/entities';
import { format } from 'date-fns';
import { Loader, LoaderCircle } from 'lucide-react';

type SessionCardProps = {
  session: AddressSessionFull;
  className?: string;
};

const SessionCard = (props: SessionCardProps): JSX.Element | null => {
  const { session, className } = props;
  // const session = {
  //   id: 21,
  //   userId: 1,
  //   createdAt: '2025-03-03T16:08:50.000Z',
  //   updatedAt: '2025-03-03T16:08:56.523Z',
  //   duration: { seconds: 6, milliseconds: 523 },
  //   isError: false,
  //   isDone: true,
  //   type: 'fias-search',
  //   title: '',
  //   notes: '',
  //   status: 'done',
  //   total: 20,
  //   done: 0,
  //   success: 0,
  //   error: 0,
  // };

  if (!session) return null;

  return (
    <div
      className={cn(
        'shadow-card bg-background flex flex-col gap-2 rounded-lg border p-6',
        className,
      )}
    >
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
          value={session?.status || '-'}
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
          value={session?.success || 0}
          className="flex-grow"
        />
        <InfoBox
          label="Не найдено:"
          value={session?.error || 0}
          className="flex-grow"
        />
      </div>
      {session.status === 'pending' && session?.queue && session?.queue > 0 ? (
        <div className="bg-muted-foreground/5 flex flex-row items-center gap-2 rounded p-2">
          <LoaderCircle className="size-5 flex-shrink-0 animate-spin" />
          <span>{`Адресов в очереди: ${session.queue}`}</span>
        </div>
      ) : null}
      {session.status === 'running' ? (
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
      {session.status === 'done' ? (
        <ExportAddressResultButton sessionId={session?.id || 0} />
      ) : null}
    </div>
  );
};

export { SessionCard };
