import { CellContext } from '@tanstack/react-table';
import { CaseActions, CaseFull } from '@urgp/shared/entities';
import { CaseSmartApproveButton } from '../../CaseButtons/CaseSmartApproveButton';
// import { ManageReminderButton } from 'libs/client/entities/src/operations';
import { Button } from '@urgp/client/shared';
import { EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useMarkReminders } from '../../../../operations';
// import { useMarkCaseRemindersAsDone } from '../../../../operations';

function SmartApproveCell(props: CellContext<CaseFull, unknown>): JSX.Element {
  const controlCase = props.row.original;
  const [mark, { isLoading: isMarkLoading }] = useMarkReminders();
  // const [markAsDone, { isLoading: isMarkLoading }] =
  //   useMarkCaseRemindersAsDone();

  // return <div>{JSON.stringify(controlCase.actions)}</div>;

  if (controlCase.actions.includes(CaseActions.caseRejected))
    //TODO: Кнопка с эскалацией или продлением срока
    return (
      <div className="w-full truncate rounded bg-amber-50 px-2 py-2 text-center">
        Не утвердили
      </div>
    );

  if (controlCase.actions.includes(CaseActions.reminderOverdue))
    //TODO: Кнопка с эскалацией или продлением срока
    return (
      <div className="w-full truncate rounded bg-rose-50 px-2 py-2 text-center">
        Нет решения
      </div>
    );

  return (
    <div onClick={(e) => e.stopPropagation()} className="flex w-full">
      {controlCase.actions.includes(CaseActions.reminderOverdue) ? (
        <div>Время вышло</div>
      ) : controlCase.actions.includes(CaseActions.reminderDone) ? (
        <Button
          role="button"
          variant="outline"
          className="flex w-full flex-row gap-2 overflow-hidden px-2"
          disabled={isMarkLoading}
          onClick={() => {
            mark({ mode: 'done', case: [controlCase.id] })
              .unwrap()
              .then(() => {
                toast.success('Напоминание снято');
              })
              .catch((rejected: any) =>
                toast.error('Не удалось снять напоминание', {
                  description: rejected.data?.message || 'Неизвестная ошибка',
                }),
              );
          }}
        >
          <EyeOff className="size-5 flex-shrink-0" />
          <span className="flex-shrink truncate">Забыть</span>
        </Button>
      ) : (
        <CaseSmartApproveButton
          variant="outline"
          controlCase={controlCase}
          className="w-full overflow-hidden truncate"
          approveCaseLabel="Дело"
          approveOperationLabel="Этап"
          rejectLabel=""
          buttonClassName="px-2"
        />
      )}
    </div>
  );
}

export { SmartApproveCell };
