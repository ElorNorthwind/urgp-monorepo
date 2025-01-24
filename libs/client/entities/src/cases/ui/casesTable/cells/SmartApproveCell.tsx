import { CellContext } from '@tanstack/react-table';
import { CaseOrPending, CaseWithPendingInfo } from '@urgp/shared/entities';
import { CaseSmartApproveButton } from '../../CaseButtons/CaseSmartApproveButton';
// import { ManageReminderButton } from 'libs/client/entities/src/operations';
import {
  ManageReminderButton,
  useMarkCaseRemindersAsDone,
  useReminders,
} from '../../../../operations';
import { toast } from 'sonner';
import { Button } from '@urgp/client/shared';
import { EyeOff } from 'lucide-react';

function SmartApproveCell(
  props: CellContext<CaseOrPending, unknown>,
): JSX.Element {
  const controlCase = props.row.original as CaseWithPendingInfo;
  const [markAsDone, { isLoading: isMarkLoading }] =
    useMarkCaseRemindersAsDone();

  if (controlCase.action === 'case-rejected')
    //TODO: Кнопка с эскалацией или продлением срока
    return (
      <div className="w-full truncate rounded bg-amber-50 px-2 py-2 text-center">
        Не утвердили
      </div>
    );

  if (controlCase.action === 'reminder-overdue')
    //TODO: Кнопка с эскалацией или продлением срока
    return (
      <div className="w-full truncate rounded bg-rose-50 px-2 py-2 text-center">
        Нет решения
      </div>
    );

  return (
    <div onClick={(e) => e.stopPropagation()} className="flex w-full">
      {controlCase.action === 'reminder-overdue' ? (
        <div>Время вышло</div>
      ) : controlCase.action === 'reminder-done' ? (
        <Button
          role="button"
          variant="outline"
          className="flex w-full flex-row gap-2 overflow-hidden px-2"
          disabled={isMarkLoading}
          onClick={() => {
            markAsDone([controlCase.id])
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
